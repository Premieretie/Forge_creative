import { Request, Response } from 'express';
import { fetch } from 'undici';
import { getDb } from '../db';
import { AuthRequest } from '../middleware/auth';

export const startGoLive = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, guild_id } = req.body as { title?: string; message?: string; guild_id?: string };
    const db = await getDb();
    const userRow = await db.get('SELECT id, twitch_user_id FROM users WHERE id = ?', [req.user.id]);
    if (!userRow || !userRow.twitch_user_id) return res.status(400).json({ message: 'Twitch not linked' });

    const acc = await db.get('SELECT twitch_login FROM twitch_accounts WHERE twitch_user_id = ? LIMIT 1', [userRow.twitch_user_id]);
    const twitchLogin = acc?.twitch_login as string | undefined;
    const twitchUrl = twitchLogin ? `https://twitch.tv/${twitchLogin}` : '';

    let channelIdToUse: string | null = null;
    let guildIdToUse: string | null = null;
    if (guild_id && /^[0-9]{5,30}$/.test(guild_id)) {
      const comm = await db.get('SELECT go_live_channel_id FROM user_communities WHERE user_id = ? AND guild_id = ? LIMIT 1', [req.user.id, guild_id]);
      guildIdToUse = guild_id;
      if (comm?.go_live_channel_id) channelIdToUse = String(comm.go_live_channel_id);
    }

    await db.run(
      'INSERT INTO go_live_events (user_id, twitch_user_id, title, message, guild_id, channel_id) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, userRow.twitch_user_id, title || null, message || null, guildIdToUse, channelIdToUse]
    );

    const token = process.env.DISCORD_BOT_TOKEN;
    const channelId = channelIdToUse || process.env.DISCORD_CHANNEL_ID || '1251348093052518441';
    if (token && channelId) {
      const parts: string[] = [];
      if (title) parts.push(`**${title}**`);
      if (message) parts.push(message);
      if (twitchUrl) parts.push(twitchUrl);
      const content = parts.join('\n');
      try {
        await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bot ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });
      } catch {}
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
