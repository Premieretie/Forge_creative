import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getDb } from '../db';
import { grantRewardsIfEligible } from './twitchController';

const toMySQLDateTime = (d: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const min = pad(d.getMinutes());
  const sec = pad(d.getSeconds());
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
};

export const syncTwitchData = async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const userId = req.user.id;

    // Check if user is linked to Twitch
    const user = await db.get('SELECT twitch_user_id FROM users WHERE id = ?', [userId]);
    if (!user || !user.twitch_user_id) {
      return res.status(400).json({ message: 'Twitch account not linked' });
    }

    // Generate mock streams for the last 7 days
    const categories = ['Just Chatting', 'Valorant', 'Minecraft', 'League of Legends'];
    const platforms = ['Twitch'];
    
    // Clear existing streams for demo purposes to avoid duplicates on multiple syncs
    await db.run('DELETE FROM streams WHERE user_id = ?', [userId]);

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Randomly decide if streamed on this day (80% chance)
      if (Math.random() > 0.2) {
        const duration = Math.floor(Math.random() * 240) + 60; // 1-5 hours
        const category = categories[Math.floor(Math.random() * categories.length)];
        const platform = platforms[0];
        
        // Set start time to random evening time
        date.setHours(18 + Math.floor(Math.random() * 4), 0, 0, 0);
        const startTime = toMySQLDateTime(date);
        
        const endDate = new Date(date);
        endDate.setMinutes(endDate.getMinutes() + duration);
        const endTime = toMySQLDateTime(endDate);

        await db.run(
          `INSERT INTO streams (user_id, title, category, platform, duration_minutes, started_at, ended_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            `Stream Day ${i + 1} - ${category}`,
            category,
            platform,
            duration,
            startTime,
            endTime
          ]
        );
      }
    }

    res.json({ message: 'Stream data synced successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStreams = async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const streams = await db.all(
      'SELECT * FROM streams WHERE user_id = ? ORDER BY started_at DESC',
      [req.user.id]
    );
    res.json(streams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const mockStart = async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const userId = req.user.id;

    // Check if user is linked to Twitch (required for rewards)
    const user = await db.get('SELECT twitch_user_id FROM users WHERE id = ?', [userId]);
    const twitchUserId = user?.twitch_user_id;

    const active = await db.get(
      'SELECT id FROM streams WHERE user_id = ? AND ended_at IS NULL ORDER BY started_at DESC LIMIT 1',
      [userId]
    );
    if (active) {
      return res.status(400).json({ message: 'A test stream is already active' });
    }

    const { title, category, platform } = req.body || {};
    const streamTitle = title || 'Testing Stream - Redm Diablo County Rp';
    const streamCategory = category || 'Redm Diablo County Rp';
    const streamPlatform = platform || 'Test';

    const now = new Date();
    const startedAt = toMySQLDateTime(now);

    // Insert into streams (display)
    await db.run(
      `INSERT INTO streams (user_id, title, category, platform, duration_minutes, started_at, ended_at)
       VALUES (?, ?, ?, ?, ?, ?, NULL)`,
      [
        userId,
        streamTitle,
        streamCategory,
        streamPlatform,
        null,
        startedAt
      ]
    );

    // Identify Guild ID for rewards attribution
    let guildId: string | null = null;
    
    // 1. Try to match by "Go Live" event if it was recent? (Or just rely on category match)
    // 2. Match category to game_name in user_communities
    if (streamCategory) {
        // Try exact match first
        let comm = await db.get('SELECT guild_id FROM user_communities WHERE user_id = ? AND game_name = ? LIMIT 1', [userId, streamCategory]);
        
        // If not found, try finding a community where the game_name is part of the category string
        if (!comm) {
             const communities = await db.all('SELECT guild_id, game_name, guild_name FROM user_communities WHERE user_id = ?', [userId]);
             
             // 1. Try matching game_name
             let match = communities.find((c: any) => c.game_name && streamCategory.toLowerCase().includes(c.game_name.toLowerCase()));
             
             // 2. Fallback: Try matching guild_name
             if (!match) {
                 match = communities.find((c: any) => c.guild_name && streamCategory.toLowerCase().includes(c.guild_name.toLowerCase()));
             }
             
             if (match) comm = match;
        }

        if (comm) guildId = comm.guild_id;
    }

    // Insert into twitch_stream_sessions (rewards)
    if (twitchUserId) {
        await db.run(
            'INSERT INTO twitch_stream_sessions (user_id, twitch_user_id, started_at, processed, guild_id) VALUES (?, ?, ?, 0, ?)',
            [userId, twitchUserId, startedAt, guildId]
        );
    }

    res.status(201).json({ 
        message: `Test stream started${guildId ? ` (Tracking for community: ${guildId})` : ''}`,
        attributed_guild_id: guildId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const mockStop = async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const userId = req.user.id;

    const active = await db.get(
      'SELECT id, started_at FROM streams WHERE user_id = ? AND ended_at IS NULL ORDER BY started_at DESC LIMIT 1',
      [userId]
    );

    if (!active) {
      return res.status(400).json({ message: 'No active test stream to stop' });
    }

    const now = new Date();
    const startedAt = new Date(active.started_at);
    const minutes = Math.max(1, Math.round((now.getTime() - startedAt.getTime()) / 60000));

    // Update streams
    await db.run(
      'UPDATE streams SET ended_at = ?, duration_minutes = ? WHERE id = ?',
      [toMySQLDateTime(now), minutes, active.id]
    );

    // Update twitch_stream_sessions
    const user = await db.get('SELECT twitch_user_id FROM users WHERE id = ?', [userId]);
    const twitchUserId = user?.twitch_user_id;

    if (twitchUserId) {
        const session = await db.get(
            'SELECT id, guild_id FROM twitch_stream_sessions WHERE twitch_user_id = ? AND ended_at IS NULL ORDER BY id DESC LIMIT 1',
            [twitchUserId]
        );
        
        if (session) {
            await db.run(
                'UPDATE twitch_stream_sessions SET ended_at = ?, duration_minutes = ?, processed = 1 WHERE id = ?',
                [toMySQLDateTime(now), minutes, session.id]
            );
            
            // Trigger rewards
            if (minutes >= 0) { // Should be >= 30 normally, but for testing maybe 0 or 1?
                // The prompt says "test streaming (local)", likely short duration.
                // But rewards check logic usually requires >= 30.
                // However, the user wants to see "Communities connected Hours streamed".
                // Even if < 30, it should update the hours. 
                // The hours calculation query in discordController just sums duration_minutes where processed=1.
                // The ">= 30" check in grantRewardsIfEligible handles the specific reward granting.
                // But for "Hours Streamed" display, we just need the session recorded.
                
                await grantRewardsIfEligible(userId, twitchUserId, session.guild_id);
            }
        }
    }

    res.json({ message: 'Test stream stopped', duration_minutes: minutes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
