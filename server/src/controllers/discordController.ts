import { Response } from 'express';
import { getDb } from '../db';
import { AuthRequest } from '../middleware/auth';
import { fetch } from 'undici';

export const getConnections = async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const botToken = process.env.DISCORD_BOT_TOKEN;

    const link = await db.get('SELECT discord_user_id FROM discord_links WHERE user_id = ? LIMIT 1', [req.user.id]);
    const linked = !!link?.discord_user_id;
    const discordUserId = link?.discord_user_id as string | undefined;

    // Fetch all reward tiers
    const allTiers = await db.all('SELECT * FROM reward_tiers ORDER BY hours_required ASC');
    const globalTiers = allTiers.filter((t: any) => !t.guild_id);

    const configuredGuilds = (process.env.DISCORD_GUILD_IDS || process.env.DISCORD_GUILD_ID || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const userGuildRows = await db.all('SELECT guild_id, guild_name, game_name, go_live_channel_id FROM user_communities WHERE user_id = ?', [req.user.id]);
    const userGuildMap = new Map<string, { guild_id: string; guild_name?: string | null; game_name?: string | null; go_live_channel_id?: string | null }>();
    for (const r of userGuildRows) userGuildMap.set(String(r.guild_id), { guild_id: String(r.guild_id), guild_name: r.guild_name || null, game_name: r.game_name || null, go_live_channel_id: r.go_live_channel_id || null });

    const guilds: any[] = [];
    if (configuredGuilds.length && botToken) {
      for (const gid of configuredGuilds) {
        try {
          // Determine membership if user is linked
          let joined = false;
          if (linked && discordUserId) {
            const memResp = await fetch(`https://discord.com/api/v10/guilds/${gid}/members/${discordUserId}`, {
              headers: { Authorization: `Bot ${botToken}` }
            });
            joined = memResp.ok;
          }

          // Fetch guild meta
          let name: string | null = null;
          let iconUrl: string | null = null;
          const gResp = await fetch(`https://discord.com/api/v10/guilds/${gid}`, {
            headers: { Authorization: `Bot ${botToken}` }
          });
          if (gResp.ok) {
            const g: any = await gResp.json();
            name = g?.name || null;
            if (g?.icon) iconUrl = `https://cdn.discordapp.com/icons/${gid}/${g.icon}.png`;
          }

          // Prefer user-provided name if available
          const userMeta = userGuildMap.get(gid);
          const displayName = (userMeta?.guild_name && userMeta.guild_name.trim()) ? userMeta.guild_name : name;

          // Per-guild hours
          const hRow = await db.get(
            'SELECT COALESCE(SUM(duration_minutes), 0) AS minutes FROM twitch_stream_sessions WHERE user_id = ? AND processed = 1 AND guild_id = ?',
            [req.user.id, gid]
          );
          
          // Resolve tiers for this guild
          const guildTiers = allTiers.filter((t: any) => t.guild_id === gid);
          const effectiveTiers = guildTiers.length > 0 ? guildTiers : globalTiers;

          const minutes = Number(hRow?.minutes || 0);
          const hoursSoFar = Math.floor(minutes / 60);
          let nextGoal: any = null;
          for (const t of effectiveTiers) {
            if (hoursSoFar < Number(t.hours_required)) { nextGoal = t; break; }
          }
          const hoursUntilNext = nextGoal ? Math.max(0, Number(nextGoal.hours_required) - hoursSoFar) : 0;

          guilds.push({
            id: gid,
            name: displayName || name || 'Discord Server',
            linked,
            joined,
            icon_url: iconUrl,
            game_name: userMeta?.game_name || null,
            perks: effectiveTiers,
            hours_so_far: hoursSoFar,
            next_goal: nextGoal,
            hours_until_next_goal: hoursUntilNext
          });
        } catch {
          // ignore errors per guild
        }
      }
    }

    // Include any user-configured guilds not already in configuredGuilds
    if (botToken) {
      for (const [gid, userMeta] of userGuildMap.entries()) {
        if (configuredGuilds.includes(gid)) continue;
        try {
          let joined = false;
          if (linked && discordUserId) {
            const memResp = await fetch(`https://discord.com/api/v10/guilds/${gid}/members/${discordUserId}`, {
              headers: { Authorization: `Bot ${botToken}` }
            });
            joined = memResp.ok;
          }

          let name: string | null = userMeta.guild_name || null;
          let iconUrl: string | null = null;
          if (!name) {
            const gResp = await fetch(`https://discord.com/api/v10/guilds/${gid}`, {
              headers: { Authorization: `Bot ${botToken}` }
            });
            if (gResp.ok) {
              const g: any = await gResp.json();
              name = g?.name || null;
              if (g?.icon) iconUrl = `https://cdn.discordapp.com/icons/${gid}/${g.icon}.png`;
            }
          } else {
            const gResp = await fetch(`https://discord.com/api/v10/guilds/${gid}`, {
              headers: { Authorization: `Bot ${botToken}` }
            });
            if (gResp.ok) {
              const g: any = await gResp.json();
              if (g?.icon) iconUrl = `https://cdn.discordapp.com/icons/${gid}/${g.icon}.png`;
            }
          }

          const hRow = await db.get(
            'SELECT COALESCE(SUM(duration_minutes), 0) AS minutes FROM twitch_stream_sessions WHERE user_id = ? AND processed = 1 AND guild_id = ?',
            [req.user.id, gid]
          );
          
          // Resolve tiers for this guild
          const guildTiers = allTiers.filter((t: any) => t.guild_id === gid);
          const effectiveTiers = guildTiers.length > 0 ? guildTiers : globalTiers;

          const minutes = Number(hRow?.minutes || 0);
          const hoursSoFar = Math.floor(minutes / 60);
          let nextGoal: any = null;
          for (const t of effectiveTiers) {
            if (hoursSoFar < Number(t.hours_required)) { nextGoal = t; break; }
          }
          const hoursUntilNext = nextGoal ? Math.max(0, Number(nextGoal.hours_required) - hoursSoFar) : 0;

          guilds.push({
            id: gid,
            name: name || 'Discord Server',
            linked,
            joined,
            icon_url: iconUrl,
            game_name: userMeta?.game_name || null,
            perks: effectiveTiers,
            hours_so_far: hoursSoFar,
            next_goal: nextGoal,
            hours_until_next_goal: hoursUntilNext
          });
        } catch {}
      }
    }

    res.json({ guilds });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCommunities = async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT guild_id, guild_name, game_name, go_live_channel_id FROM user_communities WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json({ communities: rows });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const upsertCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id, channel_id, game_name } = req.body as { guild_id?: string; channel_id?: string; game_name?: string };
    if (!guild_id || !/^[0-9]{5,30}$/.test(guild_id)) return res.status(400).json({ message: 'Invalid guild_id' });
    if (channel_id && !/^[0-9]{5,30}$/.test(channel_id)) return res.status(400).json({ message: 'Invalid channel_id' });

    const botToken = process.env.DISCORD_BOT_TOKEN;
    let guildName: string | null = null;
    if (botToken) {
      try {
        const r = await fetch(`https://discord.com/api/v10/guilds/${guild_id}`, { headers: { Authorization: `Bot ${botToken}` } });
        if (r.ok) {
          const g: any = await r.json();
          guildName = g?.name || null;
        }
      } catch {}
    }

    const db = await getDb();
    await db.run(
      `INSERT INTO user_communities (user_id, guild_id, guild_name, game_name, go_live_channel_id)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE guild_name = VALUES(guild_name), game_name = VALUES(game_name), go_live_channel_id = VALUES(go_live_channel_id)`,
      [req.user.id, guild_id, guildName, game_name || null, channel_id || null]
    );

    res.json({ ok: true, guild_id, guild_name: guildName, game_name: game_name || null, channel_id: channel_id || null });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const { guild_id } = req.params as { guild_id: string };
    if (!guild_id || !/^[0-9]{5,30}$/.test(guild_id)) return res.status(400).json({ message: 'Invalid guild_id' });
    const db = await getDb();
    await db.run('DELETE FROM user_communities WHERE user_id = ? AND guild_id = ?', [req.user.id, guild_id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLink = async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const row = await db.get('SELECT discord_user_id FROM discord_links WHERE user_id = ? LIMIT 1', [req.user.id]);
    res.json({ discord_user_id: row?.discord_user_id || null });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
