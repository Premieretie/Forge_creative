
import { Response } from 'express';
import { getDb } from '../db';
import { AuthRequest } from '../middleware/auth';
import { fetch } from 'undici';

// Get communities where the user is a staff member
export const getStaffCommunities = async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const userId = req.user.id;
    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!botToken) return res.json({ communities: [] });

    // Get user's linked discord ID
    const link = await db.get('SELECT discord_user_id FROM discord_links WHERE user_id = ?', [userId]);
    if (!link?.discord_user_id) return res.json({ communities: [] });
    const discordUserId = link.discord_user_id;

    // Get all communities that have staff roles configured
    const communities = await db.all('SELECT DISTINCT c.guild_id, c.name FROM communities c JOIN community_staff_roles csr ON c.guild_id = csr.guild_id');
    
    const staffCommunities = [];

    for (const comm of communities) {
        // Check if user has any of the staff roles in this guild
        // We need to fetch the user's roles in this guild from Discord
        try {
            const memResp = await fetch(`https://discord.com/api/v10/guilds/${comm.guild_id}/members/${discordUserId}`, {
                headers: { Authorization: `Bot ${botToken}` }
            });
            
            if (memResp.ok) {
                const member: any = await memResp.json();
                const userRoles = member.roles || [];
                
                // Get configured staff roles for this guild
                const staffRoles = await db.all('SELECT role_id FROM community_staff_roles WHERE guild_id = ?', [comm.guild_id]);
                const staffRoleIds = staffRoles.map((r: any) => r.role_id);
                
                // Check intersection
                const isStaff = userRoles.some((r: string) => staffRoleIds.includes(r));
                
                if (isStaff) {
                    staffCommunities.push(comm);
                }
            }
        } catch (e) {
            // ignore error
        }
    }

    res.json({ communities: staffCommunities });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id, ticket_ref, notes } = req.body;
    if (!guild_id || !ticket_ref) return res.status(400).json({ message: 'Missing fields' });
    
    const db = await getDb();
    
    // Check settings for this community
    const comm = await db.get('SELECT require_ticket_review FROM communities WHERE guild_id = ?', [guild_id]);
    const requireReview = comm ? !!comm.require_ticket_review : false;
    
    const status = requireReview ? 'pending' : 'approved';
    const reviewedBy = requireReview ? null : req.user.id; // Auto-approved? Or maybe system? Let's say null if auto, or user himself if trusted. Actually null is safer for "system/auto".
    const reviewedAt = requireReview ? null : new Date().toISOString().slice(0, 19).replace('T', ' ');

    await db.run(
        'INSERT INTO staff_tickets (guild_id, user_id, ticket_ref, notes, status, reviewed_by, reviewed_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [guild_id, req.user.id, ticket_ref, notes, status, reviewedBy, reviewedAt]
    );
    
    res.json({ ok: true, status });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStaffStats = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id } = req.params;
    const db = await getDb();
    
    // Verify is staff (optional, but good practice. For now assuming UI handles access, and we just fetch data for user)
    
    const stats = await db.get(`
        SELECT 
            COUNT(*) as total_logged,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_tickets,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tickets
        FROM staff_tickets 
        WHERE user_id = ? AND guild_id = ?
    `, [req.user.id, guild_id]);
    
    // Get recent logs
    const recent = await db.all(`
        SELECT * FROM staff_tickets WHERE user_id = ? AND guild_id = ? ORDER BY created_at DESC LIMIT 10
    `, [req.user.id, guild_id]);
    
    // Get next perk
    const approvedCount = stats?.approved_tickets || 0;
    
    // Fetch ticket-based perks
    const perks = await db.all('SELECT * FROM reward_tiers WHERE guild_id = ? AND criteria_type = "tickets" ORDER BY tickets_required ASC', [guild_id]);
    
    let nextGoal: any = null;
    for (const p of perks) {
        if (approvedCount < p.tickets_required) {
            nextGoal = p;
            break;
        }
    }
    
    res.json({ 
        stats: {
            total: stats?.total_logged || 0,
            approved: approvedCount,
            pending: stats?.pending_tickets || 0
        },
        recent,
        next_goal: nextGoal,
        perks // Return all perks to show progress
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};
