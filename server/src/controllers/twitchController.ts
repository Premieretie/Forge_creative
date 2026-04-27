import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { fetch } from 'undici';
import { getDb } from '../db';
import { AuthRequest } from '../middleware/auth';

const TWITCH_OAUTH_AUTHORIZE = 'https://id.twitch.tv/oauth2/authorize';
const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
const TWITCH_HELIX_BASE = 'https://api.twitch.tv/helix';

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

let appAccessToken: { token: string; expiresAt: number } | null = null;

async function getAppAccessToken() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('Missing TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET');

  const now = Date.now();
  if (appAccessToken && appAccessToken.expiresAt > now + 60_000) return appAccessToken.token;

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  });
  const resp = await fetch(TWITCH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!resp.ok) throw new Error('Failed to obtain app access token');
  const data: any = await resp.json();
  const expiresIn = Number(data.expires_in || 3600);
  appAccessToken = { token: data.access_token, expiresAt: now + (expiresIn * 1000) };
  return appAccessToken.token;
}

export const getOauthUrl = async (req: AuthRequest, res: Response) => {
  try {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const redirectUri = process.env.TWITCH_REDIRECT_URI;
    if (!clientId || !redirectUri) return res.status(500).json({ message: 'Twitch OAuth not configured' });

    const state = jwt.sign({ uid: req.user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '10m' });
    const scope = encodeURIComponent('user:read:email');
    const authUrl = `${TWITCH_OAUTH_AUTHORIZE}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${encodeURIComponent(state)}`;
    res.json({ url: authUrl });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const oauthCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;
    if (!code || !state) return res.status(400).send('Missing code/state');

    let decoded: any;
    try {
      decoded = jwt.verify(state, process.env.JWT_SECRET || 'secret');
    } catch {
      return res.status(400).send('Invalid state');
    }
    const userId = decoded.uid as number;

    const clientId = process.env.TWITCH_CLIENT_ID!;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET!;
    const redirectUri = process.env.TWITCH_REDIRECT_URI!;

    const tokenBody = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });
    const tokenResp = await fetch(TWITCH_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenBody.toString(),
    });
    if (!tokenResp.ok) {
      const t = await tokenResp.text();
      return res.status(400).send('Token exchange failed');
    }
    const tokenData: any = await tokenResp.json();
    const accessToken = tokenData.access_token as string;
    const refreshToken = tokenData.refresh_token as string | undefined;

    const userResp = await fetch(`${TWITCH_HELIX_BASE}/users`, {
      headers: {
        'Client-Id': clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!userResp.ok) return res.status(400).send('Failed to fetch Twitch user');
    const udata: any = await userResp.json();
    const user = udata.data && udata.data[0];
    if (!user) return res.status(400).send('No Twitch user');

    const twitchUserId = user.id as string;
    const twitchLogin = user.login as string;
    const twitchDisplayName = user.display_name as string;

    const db = await getDb();

    await db.run(
      `INSERT INTO twitch_accounts (user_id, twitch_user_id, twitch_login, twitch_display_name, access_token, refresh_token)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), twitch_login = VALUES(twitch_login), twitch_display_name = VALUES(twitch_display_name), access_token = VALUES(access_token), refresh_token = VALUES(refresh_token)`,
      [userId, twitchUserId, twitchLogin, twitchDisplayName, accessToken, refreshToken || null]
    );

    await db.run('UPDATE users SET twitch_user_id = ? WHERE id = ?', [twitchUserId, userId]);

    try {
      await subscribeToEventSub(twitchUserId);
    } catch {}

    const frontend = process.env.FRONTEND_URL || 'http://localhost:3001';
    res.redirect(302, `${frontend}/dashboard/settings?twitch=linked`);
  } catch (e) {
    res.status(500).send('Server error');
  }
};

async function subscribeToEventSub(twitchUserId: string) {
  const token = await getAppAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID!;
  const callback = process.env.TWITCH_EVENTSUB_CALLBACK;
  const secret = process.env.TWITCH_EVENTSUB_SECRET;
  if (!callback || !secret) throw new Error('EventSub not configured');

  const types = ['stream.online', 'stream.offline'];
  for (const type of types) {
    await fetch(`${TWITCH_HELIX_BASE}/eventsub/subscriptions`, {
      method: 'POST',
      headers: {
        'Client-Id': clientId,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        version: '1',
        condition: { broadcaster_user_id: twitchUserId },
        transport: { method: 'webhook', callback, secret },
      }),
    });
  }
}

async function getLiveStreamInfo(twitchUserId: string) {
  const token = await getAppAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID!;
  const resp = await fetch(`${TWITCH_HELIX_BASE}/streams?user_id=${encodeURIComponent(twitchUserId)}`, {
    headers: { 'Client-Id': clientId, Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) return null;
  const data: any = await resp.json();
  return data.data && data.data[0] ? data.data[0] : null;
}

export async function grantRewardsIfEligible(userId: number | null, twitchUserId: string, guildId: string | null) {
  if (!userId) return;
  const db = await getDb();
  
  // Calculate total minutes for this specific guild (or global if guildId is null)
  let query = 'SELECT COALESCE(SUM(duration_minutes), 0) AS minutes FROM twitch_stream_sessions WHERE user_id = ? AND processed = 1';
  const params: any[] = [userId];
  
  if (guildId) {
    query += ' AND guild_id = ?';
    params.push(guildId);
  } else {
    query += ' AND guild_id IS NULL';
  }

  const totalMinutesRow = await db.get(query, params);
  const minutes = Number(totalMinutesRow?.minutes || 0);
  const hours = Math.floor(minutes / 60);

  // Fetch relevant reward tiers
  let tiersQuery = 'SELECT * FROM reward_tiers WHERE ';
  const tiersParams: any[] = [];
  
  if (guildId) {
    tiersQuery += 'guild_id = ?';
    tiersParams.push(guildId);
  } else {
    tiersQuery += 'guild_id IS NULL';
  }
  
  const tiers = await db.all(tiersQuery, tiersParams);

  for (const tier of tiers) {
    if (hours >= Number(tier.hours_required)) {
      // Check if already granted
      // We must check specifically for this guild (or null) to allow earning same key in diff communities if applicable
      // The unique constraint is (user_id, guild_id, reward_key)
      let grantCheckQuery = 'SELECT id FROM granted_rewards WHERE user_id = ? AND reward_key = ?';
      const grantCheckParams: any[] = [userId, tier.reward_key];
      
      if (guildId) {
        grantCheckQuery += ' AND guild_id = ?';
        grantCheckParams.push(guildId);
      } else {
        grantCheckQuery += ' AND guild_id IS NULL';
      }
      
      const existing = await db.get(grantCheckQuery + ' LIMIT 1', grantCheckParams);

      if (!existing) {
        // Grant reward
        await db.run(
          'INSERT INTO granted_rewards (user_id, twitch_user_id, reward_key, guild_id) VALUES (?, ?, ?, ?)',
          [userId, twitchUserId, tier.reward_key, guildId]
        );
        
        // Execute Reward Action
        if (tier.reward_type === 'discord_role' && tier.reward_value) {
            if (guildId) {
                await tryAssignDiscordRole(userId, tier.reward_value, guildId);
            }
        } else if (tier.reward_type === 'game_command' && tier.reward_value) {
            await executeGameCommand(userId, tier.reward_value, guildId);
        } else if (tier.reward_key === 'discord_role_20h' && !guildId) {
            // Backward compatibility for global hardcoded role
             await tryAssignDiscordRole(userId, process.env.DISCORD_ROLE_20H || '1398962923392733214', process.env.DISCORD_GUILD_ID!);
        }
      }
    }
  }
}

export async function tryAssignDiscordRole(userId: number, roleId: string, guildId: string) {
  try {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token || !guildId) return;
    const db = await getDb();
    
    // We need the discord user ID.
    // Ideally, discord_links is global. 
    const link = await db.get('SELECT discord_user_id FROM discord_links WHERE user_id = ? LIMIT 1', [userId]);
    const discordUserId = link?.discord_user_id as string | undefined;
    
    if (!discordUserId) return;
    
    await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`, {
      method: 'PUT',
      headers: { Authorization: `Bot ${token}` },
    });
  } catch (e) {
    console.error('Failed to assign role', e);
  }
}

async function executeGameCommand(userId: number, commandTemplate: string, guildId: string | null) {
    // Placeholder for RCON/Game Server command execution
    // We need to know WHICH game server to send to.
    // Likely mapped via guild_id in user_communities or similar?
    // For now, just log it.
    console.log(`[Mock] Executing game command for user ${userId} in guild ${guildId}: ${commandTemplate}`);
    
    // TODO: Implement actual RCON/HTTP call to game server
    // We might need to replace variables in commandTemplate, e.g. {player_id}
    // const db = await getDb();
    // const acc = await db.get('SELECT linked_player_identifier FROM twitch_accounts WHERE user_id = ?', [userId]);
    // if (acc?.linked_player_identifier) {
    //    const cmd = commandTemplate.replace('{player_id}', acc.linked_player_identifier);
    //    ... send cmd ...
    // }
}

export const linkPlayerIdentifier = async (req: AuthRequest, res: Response) => {
  try {
    const { linked_player_identifier } = req.body as { linked_player_identifier: string };
    if (!linked_player_identifier) return res.status(400).json({ message: 'Missing linked_player_identifier' });
    const db = await getDb();
    const user = await db.get('SELECT twitch_user_id FROM users WHERE id = ?', [req.user.id]);
    if (!user || !user.twitch_user_id) return res.status(400).json({ message: 'Twitch not linked' });
    await db.run(
      'UPDATE twitch_accounts SET linked_player_identifier = ? WHERE twitch_user_id = ?',
      [linked_player_identifier, user.twitch_user_id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

function verifyEventSubSignature(secret: string, req: Request, rawBody: Buffer) {
  const id = req.header('Twitch-Eventsub-Message-Id') || '';
  const timestamp = req.header('Twitch-Eventsub-Message-Timestamp') || '';
  const signature = req.header('Twitch-Eventsub-Message-Signature') || '';
  const message = id + timestamp + rawBody.toString();
  const hmac = crypto.createHmac('sha256', secret).update(message).digest('hex');
  const expected = `sha256=${hmac}`;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export const eventsubWebhook = async (req: Request, res: Response) => {
  try {
    const secret = process.env.TWITCH_EVENTSUB_SECRET;
    if (!secret) return res.status(500).send('Not configured');
    const raw = req.body as Buffer;
    if (!raw || !(raw instanceof Buffer)) return res.status(400).send('Invalid body');

    const ok = verifyEventSubSignature(secret, req, raw);
    if (!ok) return res.status(403).send('Invalid signature');

    const body: any = JSON.parse(raw.toString('utf8'));
    const messageType = (req.header('Twitch-Eventsub-Message-Type') || '').toLowerCase();

    if (messageType === 'webhook_callback_verification') {
      return res.status(200).send(body.challenge);
    }

    if (messageType === 'notification') {
      const subType = body.subscription?.type;
      const event = body.event;
      const twitchUserId = event?.broadcaster_user_id as string;
      if (!twitchUserId) return res.status(200).send('ok');

      const db = await getDb();
      const acc = await db.get('SELECT user_id FROM twitch_accounts WHERE twitch_user_id = ? LIMIT 1', [twitchUserId]);
      const userId = acc?.user_id ?? null;

      if (subType === 'stream.online') {
        const stream = await getLiveStreamInfo(twitchUserId);
        const gameName = stream?.game_name as string | undefined;
        if (gameName !== 'Red Dead Redemption 2') return res.status(200).send('ignored');
        if (!userId) return res.status(200).send('ignored');
        const recent = await db.get(
          'SELECT id, guild_id FROM go_live_events WHERE user_id = ? AND created_at >= NOW() - INTERVAL 30 MINUTE ORDER BY id DESC LIMIT 1',
          [userId]
        );
        if (!recent) return res.status(200).send('ignored');

        const startedAt = event?.started_at ? new Date(event.started_at) : new Date();
        const open = await db.get(
          'SELECT id FROM twitch_stream_sessions WHERE twitch_user_id = ? AND ended_at IS NULL ORDER BY id DESC LIMIT 1',
          [twitchUserId]
        );
        if (!open) {
          await db.run(
            'INSERT INTO twitch_stream_sessions (user_id, twitch_user_id, started_at, processed, guild_id) VALUES (?, ?, ?, 0, ?)',
            [userId, twitchUserId, toMySQLDateTime(startedAt), recent?.guild_id || null]
          );
        }
        return res.status(200).send('ok');
      }

      if (subType === 'stream.offline') {
        const open = await db.get(
          'SELECT id, started_at, user_id, guild_id FROM twitch_stream_sessions WHERE twitch_user_id = ? AND ended_at IS NULL ORDER BY id DESC LIMIT 1',
          [twitchUserId]
        );
        if (open) {
          const ended = new Date();
          const started = new Date(open.started_at);
          const durationMinutes = Math.max(0, Math.round((ended.getTime() - started.getTime()) / 60000));
          await db.run(
            'UPDATE twitch_stream_sessions SET ended_at = ?, duration_minutes = ?, processed = 1 WHERE id = ?',
            [toMySQLDateTime(ended), durationMinutes, open.id]
          );
          if (durationMinutes >= 30) {
            await grantRewardsIfEligible(open.user_id, twitchUserId, open.guild_id);
          }
        }
        return res.status(200).send('ok');
      }
    }

    return res.status(200).send('ok');
  } catch (e) {
    return res.status(500).send('error');
  }
};

export const routerWithRaw = () => {
  const router = express.Router();
  router.post('/eventsub/webhook', express.raw({ type: 'application/json' }), eventsubWebhook);
  return router;
};
