"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerWithRaw = exports.eventsubWebhook = exports.linkPlayerIdentifier = exports.oauthCallback = exports.getOauthUrl = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const undici_1 = require("undici");
const db_1 = require("../db");
const TWITCH_OAUTH_AUTHORIZE = 'https://id.twitch.tv/oauth2/authorize';
const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
const TWITCH_HELIX_BASE = 'https://api.twitch.tv/helix';
const toMySQLDateTime = (d) => {
    const pad = (n) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hour = pad(d.getHours());
    const min = pad(d.getMinutes());
    const sec = pad(d.getSeconds());
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
};
let appAccessToken = null;
function getAppAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;
        if (!clientId || !clientSecret)
            throw new Error('Missing TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET');
        const now = Date.now();
        if (appAccessToken && appAccessToken.expiresAt > now + 60000)
            return appAccessToken.token;
        const body = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
        });
        const resp = yield (0, undici_1.fetch)(TWITCH_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });
        if (!resp.ok)
            throw new Error('Failed to obtain app access token');
        const data = yield resp.json();
        const expiresIn = Number(data.expires_in || 3600);
        appAccessToken = { token: data.access_token, expiresAt: now + (expiresIn * 1000) };
        return appAccessToken.token;
    });
}
const getOauthUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = process.env.TWITCH_CLIENT_ID;
        const redirectUri = process.env.TWITCH_REDIRECT_URI;
        if (!clientId || !redirectUri)
            return res.status(500).json({ message: 'Twitch OAuth not configured' });
        const state = jsonwebtoken_1.default.sign({ uid: req.user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '10m' });
        const scope = encodeURIComponent('user:read:email');
        const authUrl = `${TWITCH_OAUTH_AUTHORIZE}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${encodeURIComponent(state)}`;
        res.json({ url: authUrl });
    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getOauthUrl = getOauthUrl;
const oauthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query.code;
        const state = req.query.state;
        if (!code || !state)
            return res.status(400).send('Missing code/state');
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(state, process.env.JWT_SECRET || 'secret');
        }
        catch (_a) {
            return res.status(400).send('Invalid state');
        }
        const userId = decoded.uid;
        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;
        const redirectUri = process.env.TWITCH_REDIRECT_URI;
        const tokenBody = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
        });
        const tokenResp = yield (0, undici_1.fetch)(TWITCH_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenBody.toString(),
        });
        if (!tokenResp.ok) {
            const t = yield tokenResp.text();
            return res.status(400).send('Token exchange failed');
        }
        const tokenData = yield tokenResp.json();
        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token;
        const userResp = yield (0, undici_1.fetch)(`${TWITCH_HELIX_BASE}/users`, {
            headers: {
                'Client-Id': clientId,
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!userResp.ok)
            return res.status(400).send('Failed to fetch Twitch user');
        const udata = yield userResp.json();
        const user = udata.data && udata.data[0];
        if (!user)
            return res.status(400).send('No Twitch user');
        const twitchUserId = user.id;
        const twitchLogin = user.login;
        const twitchDisplayName = user.display_name;
        const db = yield (0, db_1.getDb)();
        yield db.run(`INSERT INTO twitch_accounts (user_id, twitch_user_id, twitch_login, twitch_display_name, access_token, refresh_token)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), twitch_login = VALUES(twitch_login), twitch_display_name = VALUES(twitch_display_name), access_token = VALUES(access_token), refresh_token = VALUES(refresh_token)`, [userId, twitchUserId, twitchLogin, twitchDisplayName, accessToken, refreshToken || null]);
        yield db.run('UPDATE users SET twitch_user_id = ? WHERE id = ?', [twitchUserId, userId]);
        try {
            yield subscribeToEventSub(twitchUserId);
        }
        catch (_b) { }
        const frontend = process.env.FRONTEND_URL || 'http://localhost:3001';
        res.redirect(302, `${frontend}/dashboard/settings?twitch=linked`);
    }
    catch (e) {
        res.status(500).send('Server error');
    }
});
exports.oauthCallback = oauthCallback;
function subscribeToEventSub(twitchUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield getAppAccessToken();
        const clientId = process.env.TWITCH_CLIENT_ID;
        const callback = process.env.TWITCH_EVENTSUB_CALLBACK;
        const secret = process.env.TWITCH_EVENTSUB_SECRET;
        if (!callback || !secret)
            throw new Error('EventSub not configured');
        const types = ['stream.online', 'stream.offline'];
        for (const type of types) {
            yield (0, undici_1.fetch)(`${TWITCH_HELIX_BASE}/eventsub/subscriptions`, {
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
    });
}
function getLiveStreamInfo(twitchUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield getAppAccessToken();
        const clientId = process.env.TWITCH_CLIENT_ID;
        const resp = yield (0, undici_1.fetch)(`${TWITCH_HELIX_BASE}/streams?user_id=${encodeURIComponent(twitchUserId)}`, {
            headers: { 'Client-Id': clientId, Authorization: `Bearer ${token}` },
        });
        if (!resp.ok)
            return null;
        const data = yield resp.json();
        return data.data && data.data[0] ? data.data[0] : null;
    });
}
function grantRewardsIfEligible(userId, twitchUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId)
            return;
        const db = yield (0, db_1.getDb)();
        const totalMinutesRow = yield db.get('SELECT COALESCE(SUM(duration_minutes), 0) AS minutes FROM twitch_stream_sessions WHERE user_id = ? AND processed = 1 AND duration_minutes >= 30', [userId]);
        const minutes = Number((totalMinutesRow === null || totalMinutesRow === void 0 ? void 0 : totalMinutesRow.minutes) || 0);
        const hours = Math.floor(minutes / 60);
        const tiers = yield db.all('SELECT reward_key, hours_required FROM reward_tiers');
        for (const tier of tiers) {
            if (hours >= Number(tier.hours_required)) {
                const existing = yield db.get('SELECT id FROM granted_rewards WHERE user_id = ? AND reward_key = ? LIMIT 1', [userId, tier.reward_key]);
                if (!existing) {
                    yield db.run('INSERT INTO granted_rewards (user_id, twitch_user_id, reward_key) VALUES (?, ?, ?)', [userId, twitchUserId, tier.reward_key]);
                    if (tier.reward_key === 'discord_role_20h') {
                        yield tryAssignDiscordRole(userId, process.env.DISCORD_ROLE_20H || '1398962923392733214');
                    }
                }
            }
        }
    });
}
function tryAssignDiscordRole(userId, roleId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = process.env.DISCORD_BOT_TOKEN;
            const guildId = process.env.DISCORD_GUILD_ID;
            if (!token || !guildId)
                return;
            const db = yield (0, db_1.getDb)();
            const link = yield db.get('SELECT discord_user_id FROM discord_links WHERE user_id = ? LIMIT 1', [userId]);
            const discordUserId = link === null || link === void 0 ? void 0 : link.discord_user_id;
            if (!discordUserId)
                return;
            yield (0, undici_1.fetch)(`https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`, {
                method: 'PUT',
                headers: { Authorization: `Bot ${token}` },
            });
        }
        catch (_a) { }
    });
}
const linkPlayerIdentifier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { linked_player_identifier } = req.body;
        if (!linked_player_identifier)
            return res.status(400).json({ message: 'Missing linked_player_identifier' });
        const db = yield (0, db_1.getDb)();
        const user = yield db.get('SELECT twitch_user_id FROM users WHERE id = ?', [req.user.id]);
        if (!user || !user.twitch_user_id)
            return res.status(400).json({ message: 'Twitch not linked' });
        yield db.run('UPDATE twitch_accounts SET linked_player_identifier = ? WHERE twitch_user_id = ?', [linked_player_identifier, user.twitch_user_id]);
        res.json({ ok: true });
    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.linkPlayerIdentifier = linkPlayerIdentifier;
function verifyEventSubSignature(secret, req, rawBody) {
    const id = req.header('Twitch-Eventsub-Message-Id') || '';
    const timestamp = req.header('Twitch-Eventsub-Message-Timestamp') || '';
    const signature = req.header('Twitch-Eventsub-Message-Signature') || '';
    const message = id + timestamp + rawBody.toString();
    const hmac = crypto_1.default.createHmac('sha256', secret).update(message).digest('hex');
    const expected = `sha256=${hmac}`;
    return crypto_1.default.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
const eventsubWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const secret = process.env.TWITCH_EVENTSUB_SECRET;
        if (!secret)
            return res.status(500).send('Not configured');
        const raw = req.body;
        if (!raw || !(raw instanceof Buffer))
            return res.status(400).send('Invalid body');
        const ok = verifyEventSubSignature(secret, req, raw);
        if (!ok)
            return res.status(403).send('Invalid signature');
        const body = JSON.parse(raw.toString('utf8'));
        const messageType = (req.header('Twitch-Eventsub-Message-Type') || '').toLowerCase();
        if (messageType === 'webhook_callback_verification') {
            return res.status(200).send(body.challenge);
        }
        if (messageType === 'notification') {
            const subType = (_a = body.subscription) === null || _a === void 0 ? void 0 : _a.type;
            const event = body.event;
            const twitchUserId = event === null || event === void 0 ? void 0 : event.broadcaster_user_id;
            if (!twitchUserId)
                return res.status(200).send('ok');
            const db = yield (0, db_1.getDb)();
            const acc = yield db.get('SELECT user_id FROM twitch_accounts WHERE twitch_user_id = ? LIMIT 1', [twitchUserId]);
            const userId = (_b = acc === null || acc === void 0 ? void 0 : acc.user_id) !== null && _b !== void 0 ? _b : null;
            if (subType === 'stream.online') {
                const stream = yield getLiveStreamInfo(twitchUserId);
                const gameName = stream === null || stream === void 0 ? void 0 : stream.game_name;
                if (gameName !== 'Red Dead Redemption 2')
                    return res.status(200).send('ignored');
                if (!userId)
                    return res.status(200).send('ignored');
                const recent = yield db.get('SELECT id, guild_id FROM go_live_events WHERE user_id = ? AND created_at >= NOW() - INTERVAL 30 MINUTE ORDER BY id DESC LIMIT 1', [userId]);
                if (!recent)
                    return res.status(200).send('ignored');
                const startedAt = (event === null || event === void 0 ? void 0 : event.started_at) ? new Date(event.started_at) : new Date();
                const open = yield db.get('SELECT id FROM twitch_stream_sessions WHERE twitch_user_id = ? AND ended_at IS NULL ORDER BY id DESC LIMIT 1', [twitchUserId]);
                if (!open) {
                    yield db.run('INSERT INTO twitch_stream_sessions (user_id, twitch_user_id, started_at, processed, guild_id) VALUES (?, ?, ?, 0, ?)', [userId, twitchUserId, toMySQLDateTime(startedAt), (recent === null || recent === void 0 ? void 0 : recent.guild_id) || null]);
                }
                return res.status(200).send('ok');
            }
            if (subType === 'stream.offline') {
                const open = yield db.get('SELECT id, started_at, user_id FROM twitch_stream_sessions WHERE twitch_user_id = ? AND ended_at IS NULL ORDER BY id DESC LIMIT 1', [twitchUserId]);
                if (open) {
                    const ended = new Date();
                    const started = new Date(open.started_at);
                    const durationMinutes = Math.max(0, Math.round((ended.getTime() - started.getTime()) / 60000));
                    yield db.run('UPDATE twitch_stream_sessions SET ended_at = ?, duration_minutes = ?, processed = 1 WHERE id = ?', [toMySQLDateTime(ended), durationMinutes, open.id]);
                    if (durationMinutes >= 30) {
                        yield grantRewardsIfEligible(open.user_id, twitchUserId);
                    }
                }
                return res.status(200).send('ok');
            }
        }
        return res.status(200).send('ok');
    }
    catch (e) {
        return res.status(500).send('error');
    }
});
exports.eventsubWebhook = eventsubWebhook;
const routerWithRaw = () => {
    const router = express_1.default.Router();
    router.post('/eventsub/webhook', express_1.default.raw({ type: 'application/json' }), exports.eventsubWebhook);
    return router;
};
exports.routerWithRaw = routerWithRaw;
