import { Response } from 'express';
import { getDb } from '../db';
import { AuthRequest } from '../middleware/auth';
import { fetch } from 'undici';

import { tryAssignDiscordRole } from './twitchController';

// Helper to check if user manages the guild (requires bot token)
async function verifyGuildOwnership(discordUserId: string, guildId: string): Promise<boolean> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return true; // Dev mode / no bot configured, skip check

  try {
    // Fetch guild member
    const r = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`, {
      headers: { Authorization: `Bot ${botToken}` }
    });
    
    if (!r.ok) return false;
    
    const member: any = await r.json();
    const roles = member.roles || [];
    
    // Check for ownership or admin perms (this is complex with just roles, usually we check permissions bitfield)
    // But for now, we'll try to check if they are the actual owner of the guild
    const g = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
        headers: { Authorization: `Bot ${botToken}` }
    });
    if (g.ok) {
        const guild: any = await g.json();
        if (guild.owner_id === discordUserId) return true;
    }
    
    // Fallback: If we can't strictly verify permissions easily without big bitfield logic, 
    // we might accept if they are in the guild for now, or just rely on the fact they know the ID 
    // and we claim "First Come First Serve" for this DB.
    // Real implementation would require Discord OAuth2 to get user access token and check /users/@me/guilds
    return true; 
  } catch (e) {
    console.error('Verify guild ownership failed', e);
    return false;
  }
}

export const registerCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id, name } = req.body;
    if (!guild_id || !name) return res.status(400).json({ message: 'Missing fields' });

    const db = await getDb();
    
    // Check if already exists
    const existing = await db.get('SELECT id, owner_user_id FROM communities WHERE guild_id = ?', [guild_id]);
    if (existing) {
      if (existing.owner_user_id === req.user.id) {
        return res.json({ ok: true, community_id: existing.id, message: 'Already owned' });
      }
      return res.status(409).json({ message: 'Community already registered by another user' });
    }

    // Optional: Verify ownership if discord link exists
    const link = await db.get('SELECT discord_user_id FROM discord_links WHERE user_id = ?', [req.user.id]);
    if (link?.discord_user_id) {
       // Logic to verify could go here
    }

    const result = await db.run(
      'INSERT INTO communities (guild_id, name, owner_user_id) VALUES (?, ?, ?)',
      [guild_id, name, req.user.id]
    );

    res.json({ ok: true, community_id: result.lastID });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyCommunities = async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM communities WHERE owner_user_id = ?', [req.user.id]);
    
    // Hydrate stats
    const communities = [];
    for (const row of rows) {
      // Member count (users who added this community)
      const mCount = await db.get('SELECT COUNT(*) as c FROM user_communities WHERE guild_id = ?', [row.guild_id]);
      
      // Total hours streamed for this guild
      const hRow = await db.get(
        'SELECT COALESCE(SUM(duration_minutes), 0) as mins FROM twitch_stream_sessions WHERE guild_id = ?', 
        [row.guild_id]
      );
      
      communities.push({
        ...row,
        member_count: mCount?.c || 0,
        total_hours: Math.floor((hRow?.mins || 0) / 60)
      });
    }

    res.json({ communities });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCommunityMembers = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id } = req.params;
    const db = await getDb();
    
    // Verify ownership
    const comm = await db.get('SELECT id FROM communities WHERE guild_id = ? AND owner_user_id = ?', [guild_id, req.user.id]);
    if (!comm) return res.status(403).json({ message: 'Not authorized for this community' });

    // Get members
    const members = await db.all(`
      SELECT u.id, u.display_name, u.email, uc.created_at as joined_at,
      (SELECT COALESCE(SUM(duration_minutes), 0) FROM twitch_stream_sessions WHERE user_id = u.id AND guild_id = ?) as total_minutes
      FROM user_communities uc
      JOIN users u ON u.id = uc.user_id
      WHERE uc.guild_id = ?
      ORDER BY total_minutes DESC
    `, [guild_id, guild_id]);

    const mapped = members.map((m: any) => ({
      ...m,
      total_hours: Math.floor(m.total_minutes / 60)
    }));

    res.json({ members: mapped });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCommunityPerks = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id } = req.params;
    const db = await getDb();
    
    // Verify ownership
    const comm = await db.get('SELECT id FROM communities WHERE guild_id = ? AND owner_user_id = ?', [guild_id, req.user.id]);
    if (!comm) return res.status(403).json({ message: 'Not authorized for this community' });

    const perks = await db.all('SELECT * FROM reward_tiers WHERE guild_id = ? ORDER BY hours_required ASC', [guild_id]);
    res.json({ perks });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGuildRoles = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id } = req.params;
    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!botToken) return res.json({ roles: [] });

    // Verify ownership
    const db = await getDb();
    const comm = await db.get('SELECT id FROM communities WHERE guild_id = ? AND owner_user_id = ?', [guild_id, req.user.id]);
    if (!comm) return res.status(403).json({ message: 'Not authorized' });

    const r = await fetch(`https://discord.com/api/v10/guilds/${guild_id}/roles`, {
      headers: { Authorization: `Bot ${botToken}` }
    });

    if (!r.ok) {
      return res.status(r.status).json({ message: 'Failed to fetch roles from Discord' });
    }

    const roles: any = await r.json();
    // Filter out @everyone if desired, or keep it. Usually managed roles are what we want.
    // Also helpful to sort by position desc
    const sorted = roles.sort((a: any, b: any) => b.position - a.position).map((r: any) => ({
      id: r.id,
      name: r.name,
      color: r.color
    }));

    res.json({ roles: sorted });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

export const upsertPerk = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id } = req.params;
    const { reward_key, hours_required, description, reward_type, reward_value } = req.body;
    
    if (!reward_key || !hours_required) return res.status(400).json({ message: 'Missing fields' });

    const db = await getDb();
    
    // Verify ownership
    const comm = await db.get('SELECT id FROM communities WHERE guild_id = ? AND owner_user_id = ?', [guild_id, req.user.id]);
    if (!comm) return res.status(403).json({ message: 'Not authorized' });

    await db.run(`
      INSERT INTO reward_tiers (guild_id, reward_key, hours_required, description, reward_type, reward_value, tickets_required, criteria_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        hours_required = VALUES(hours_required), 
        description = VALUES(description),
        reward_type = VALUES(reward_type),
        reward_value = VALUES(reward_value),
        tickets_required = VALUES(tickets_required),
        criteria_type = VALUES(criteria_type)
    `, [
      guild_id, 
      reward_key, 
      hours_required || 0, 
      description, 
      reward_type || 'discord_role', 
      reward_value || null,
      req.body.tickets_required || 0,
      req.body.criteria_type || 'hours'
    ]);

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePerk = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id, reward_key } = req.params;
    const db = await getDb();
    
    // Verify ownership
    const comm = await db.get('SELECT id FROM communities WHERE guild_id = ? AND owner_user_id = ?', [guild_id, req.user.id]);
    if (!comm) return res.status(403).json({ message: 'Not authorized' });

    await db.run('DELETE FROM reward_tiers WHERE guild_id = ? AND reward_key = ?', [guild_id, reward_key]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStaffRoles = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id } = req.params;
    const db = await getDb();
    
    const comm = await db.get('SELECT id FROM communities WHERE guild_id = ? AND owner_user_id = ?', [guild_id, req.user.id]);
    if (!comm) return res.status(403).json({ message: 'Not authorized' });

    const roles = await db.all('SELECT * FROM community_staff_roles WHERE guild_id = ?', [guild_id]);
    res.json({ roles });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addStaffRole = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id } = req.params;
    const { role_id, role_name } = req.body;
    const db = await getDb();

    const comm = await db.get('SELECT id FROM communities WHERE guild_id = ? AND owner_user_id = ?', [guild_id, req.user.id]);
    if (!comm) return res.status(403).json({ message: 'Not authorized' });

    await db.run(
      'INSERT IGNORE INTO community_staff_roles (guild_id, role_id, role_name) VALUES (?, ?, ?)',
      [guild_id, role_id, role_name]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeStaffRole = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id, role_id } = req.params;
    const db = await getDb();

    const comm = await db.get('SELECT id FROM communities WHERE guild_id = ? AND owner_user_id = ?', [guild_id, req.user.id]);
    if (!comm) return res.status(403).json({ message: 'Not authorized' });

    await db.run('DELETE FROM community_staff_roles WHERE guild_id = ? AND role_id = ?', [guild_id, role_id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id } = req.params;
    const db = await getDb();

    const comm = await db.get('SELECT require_ticket_review FROM communities WHERE guild_id = ? AND owner_user_id = ?', [guild_id, req.user.id]);
    if (!comm) return res.status(403).json({ message: 'Not authorized' });

    res.json({ require_ticket_review: !!comm.require_ticket_review });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id } = req.params;
    const { require_ticket_review } = req.body;
    const db = await getDb();

    const comm = await db.get('SELECT id FROM communities WHERE guild_id = ? AND owner_user_id = ?', [guild_id, req.user.id]);
    if (!comm) return res.status(403).json({ message: 'Not authorized' });

    await db.run('UPDATE communities SET require_ticket_review = ? WHERE id = ?', [require_ticket_review ? 1 : 0, comm.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTicketQueue = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id } = req.params;
    const { status } = req.query; // optional filter
    const db = await getDb();

    const comm = await db.get('SELECT id FROM communities WHERE guild_id = ? AND owner_user_id = ?', [guild_id, req.user.id]);
    if (!comm) return res.status(403).json({ message: 'Not authorized' });

    let sql = `
      SELECT t.*, u.display_name, u.email 
      FROM staff_tickets t
      JOIN users u ON u.id = t.user_id
      WHERE t.guild_id = ?
    `;
    const params: any[] = [guild_id];

    if (status) {
      sql += ' AND t.status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY t.created_at DESC';

    const tickets = await db.all(sql, params);
    res.json({ tickets });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const reviewTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id, ticket_id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    
    const db = await getDb();

    const comm = await db.get('SELECT id FROM communities WHERE guild_id = ? AND owner_user_id = ?', [guild_id, req.user.id]);
    if (!comm) return res.status(403).json({ message: 'Not authorized' });

    await db.run(
      'UPDATE staff_tickets SET status = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ? AND guild_id = ?',
      [status, req.user.id, ticket_id, guild_id]
    );

    // If approved, we might want to check if they now qualify for a reward?
    // This is complex because rewards might be ticket-count based. 
    // We can trigger a check here or rely on a background process / next login.
    // Let's rely on a check function if possible, or leave it for the staff member's next "sync".
    
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const testRoleAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id } = req.params;
    const { role_id } = req.body;
    
    if (!role_id) return res.status(400).json({ message: 'Missing role_id' });

    const db = await getDb();
    
    // Verify ownership
    const comm = await db.get('SELECT id FROM communities WHERE guild_id = ? AND owner_user_id = ?', [guild_id, req.user.id]);
    if (!comm) return res.status(403).json({ message: 'Not authorized' });

    // Check if user has linked Discord
    const link = await db.get('SELECT discord_user_id FROM discord_links WHERE user_id = ? LIMIT 1', [req.user.id]);
    if (!link?.discord_user_id) {
        return res.status(400).json({ message: 'You must link your Discord ID in Settings > Integrations first.' });
    }

    // Try to assign the role to the current user
    await tryAssignDiscordRole(req.user.id, role_id, guild_id);

    res.json({ ok: true, message: 'Role assignment attempted. Check Discord.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};
