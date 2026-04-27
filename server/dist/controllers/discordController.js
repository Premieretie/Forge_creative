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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLink = exports.getLink = exports.deleteCommunity = exports.upsertCommunity = exports.getCommunities = exports.getConnections = void 0;
const db_1 = require("../db");
const undici_1 = require("undici");
const getConnections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, db_1.getDb)();
        const botToken = process.env.DISCORD_BOT_TOKEN;
        const link = yield db.get('SELECT discord_user_id FROM discord_links WHERE user_id = ? LIMIT 1', [req.user.id]);
        const linked = !!(link === null || link === void 0 ? void 0 : link.discord_user_id);
        const discordUserId = link === null || link === void 0 ? void 0 : link.discord_user_id;
        const tiers = yield db.all('SELECT reward_key, hours_required, description FROM reward_tiers ORDER BY hours_required ASC');
        const configuredGuilds = (process.env.DISCORD_GUILD_IDS || process.env.DISCORD_GUILD_ID || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        const userGuildRows = yield db.all('SELECT guild_id, guild_name, game_name, go_live_channel_id FROM user_communities WHERE user_id = ?', [req.user.id]);
        const userGuildMap = new Map();
        for (const r of userGuildRows)
            userGuildMap.set(String(r.guild_id), { guild_id: String(r.guild_id), guild_name: r.guild_name || null, game_name: r.game_name || null, go_live_channel_id: r.go_live_channel_id || null });
        const guilds = [];
        if (configuredGuilds.length && botToken) {
            for (const gid of configuredGuilds) {
                try {
                    // Determine membership if user is linked
                    let joined = false;
                    if (linked && discordUserId) {
                        const memResp = yield (0, undici_1.fetch)(`https://discord.com/api/v10/guilds/${gid}/members/${discordUserId}`, {
                            headers: { Authorization: `Bot ${botToken}` }
                        });
                        joined = memResp.ok;
                    }
                    // Fetch guild meta
                    let name = null;
                    let iconUrl = null;
                    const gResp = yield (0, undici_1.fetch)(`https://discord.com/api/v10/guilds/${gid}`, {
                        headers: { Authorization: `Bot ${botToken}` }
                    });
                    if (gResp.ok) {
                        const g = yield gResp.json();
                        name = (g === null || g === void 0 ? void 0 : g.name) || null;
                        if (g === null || g === void 0 ? void 0 : g.icon)
                            iconUrl = `https://cdn.discordapp.com/icons/${gid}/${g.icon}.png`;
                    }
                    // Prefer user-provided name if available
                    const userMeta = userGuildMap.get(gid);
                    const displayName = ((userMeta === null || userMeta === void 0 ? void 0 : userMeta.guild_name) && userMeta.guild_name.trim()) ? userMeta.guild_name : name;
                    // Per-guild hours
                    const hRow = yield db.get('SELECT COALESCE(SUM(duration_minutes), 0) AS minutes FROM twitch_stream_sessions WHERE user_id = ? AND processed = 1 AND guild_id = ?', [req.user.id, gid]);
                    const minutes = Number((hRow === null || hRow === void 0 ? void 0 : hRow.minutes) || 0);
                    const hoursSoFar = Math.floor(minutes / 60);
                    let nextGoal = null;
                    for (const t of tiers) {
                        if (hoursSoFar < Number(t.hours_required)) {
                            nextGoal = t;
                            break;
                        }
                    }
                    const hoursUntilNext = nextGoal ? Math.max(0, Number(nextGoal.hours_required) - hoursSoFar) : 0;
                    guilds.push({
                        id: gid,
                        name: displayName || name || 'Discord Server',
                        linked,
                        joined,
                        icon_url: iconUrl,
                        game_name: (userMeta === null || userMeta === void 0 ? void 0 : userMeta.game_name) || null,
                        perks: tiers,
                        hours_so_far: hoursSoFar,
                        next_goal: nextGoal,
                        hours_until_next_goal: hoursUntilNext
                    });
                }
                catch (_a) {
                    // ignore errors per guild
                }
            }
        }
        // Include any user-configured guilds not already in configuredGuilds
        if (botToken) {
            for (const [gid, userMeta] of userGuildMap.entries()) {
                if (configuredGuilds.includes(gid))
                    continue;
                try {
                    let joined = false;
                    if (linked && discordUserId) {
                        const memResp = yield (0, undici_1.fetch)(`https://discord.com/api/v10/guilds/${gid}/members/${discordUserId}`, {
                            headers: { Authorization: `Bot ${botToken}` }
                        });
                        joined = memResp.ok;
                    }
                    let name = userMeta.guild_name || null;
                    let iconUrl = null;
                    if (!name) {
                        const gResp = yield (0, undici_1.fetch)(`https://discord.com/api/v10/guilds/${gid}`, {
                            headers: { Authorization: `Bot ${botToken}` }
                        });
                        if (gResp.ok) {
                            const g = yield gResp.json();
                            name = (g === null || g === void 0 ? void 0 : g.name) || null;
                            if (g === null || g === void 0 ? void 0 : g.icon)
                                iconUrl = `https://cdn.discordapp.com/icons/${gid}/${g.icon}.png`;
                        }
                    }
                    else {
                        const gResp = yield (0, undici_1.fetch)(`https://discord.com/api/v10/guilds/${gid}`, {
                            headers: { Authorization: `Bot ${botToken}` }
                        });
                        if (gResp.ok) {
                            const g = yield gResp.json();
                            if (g === null || g === void 0 ? void 0 : g.icon)
                                iconUrl = `https://cdn.discordapp.com/icons/${gid}/${g.icon}.png`;
                        }
                    }
                    const hRow = yield db.get('SELECT COALESCE(SUM(duration_minutes), 0) AS minutes FROM twitch_stream_sessions WHERE user_id = ? AND processed = 1 AND guild_id = ?', [req.user.id, gid]);
                    const minutes = Number((hRow === null || hRow === void 0 ? void 0 : hRow.minutes) || 0);
                    const hoursSoFar = Math.floor(minutes / 60);
                    let nextGoal = null;
                    for (const t of tiers) {
                        if (hoursSoFar < Number(t.hours_required)) {
                            nextGoal = t;
                            break;
                        }
                    }
                    const hoursUntilNext = nextGoal ? Math.max(0, Number(nextGoal.hours_required) - hoursSoFar) : 0;
                    guilds.push({
                        id: gid,
                        name: name || 'Discord Server',
                        linked,
                        joined,
                        icon_url: iconUrl,
                        game_name: (userMeta === null || userMeta === void 0 ? void 0 : userMeta.game_name) || null,
                        perks: tiers,
                        hours_so_far: hoursSoFar,
                        next_goal: nextGoal,
                        hours_until_next_goal: hoursUntilNext
                    });
                }
                catch (_b) { }
            }
        }
        res.json({ guilds });
    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getConnections = getConnections;
const getCommunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, db_1.getDb)();
        const rows = yield db.all('SELECT guild_id, guild_name, game_name, go_live_channel_id FROM user_communities WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json({ communities: rows });
    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getCommunities = getCommunities;
const upsertCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { guild_id, channel_id, game_name } = req.body;
        if (!guild_id || !/^[0-9]{5,30}$/.test(guild_id))
            return res.status(400).json({ message: 'Invalid guild_id' });
        if (channel_id && !/^[0-9]{5,30}$/.test(channel_id))
            return res.status(400).json({ message: 'Invalid channel_id' });
        const botToken = process.env.DISCORD_BOT_TOKEN;
        let guildName = null;
        if (botToken) {
            try {
                const r = yield (0, undici_1.fetch)(`https://discord.com/api/v10/guilds/${guild_id}`, { headers: { Authorization: `Bot ${botToken}` } });
                if (r.ok) {
                    const g = yield r.json();
                    guildName = (g === null || g === void 0 ? void 0 : g.name) || null;
                }
            }
            catch (_a) { }
        }
        const db = yield (0, db_1.getDb)();
        yield db.run(`INSERT INTO user_communities (user_id, guild_id, guild_name, game_name, go_live_channel_id)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE guild_name = VALUES(guild_name), game_name = VALUES(game_name), go_live_channel_id = VALUES(go_live_channel_id)`, [req.user.id, guild_id, guildName, game_name || null, channel_id || null]);
        res.json({ ok: true, guild_id, guild_name: guildName, game_name: game_name || null, channel_id: channel_id || null });
    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.upsertCommunity = upsertCommunity;
const deleteCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { guild_id } = req.params;
        if (!guild_id || !/^[0-9]{5,30}$/.test(guild_id))
            return res.status(400).json({ message: 'Invalid guild_id' });
        const db = yield (0, db_1.getDb)();
        yield db.run('DELETE FROM user_communities WHERE user_id = ? AND guild_id = ?', [req.user.id, guild_id]);
        res.json({ ok: true });
    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteCommunity = deleteCommunity;
const getLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, db_1.getDb)();
        const row = yield db.get('SELECT discord_user_id FROM discord_links WHERE user_id = ? LIMIT 1', [req.user.id]);
        res.json({ discord_user_id: (row === null || row === void 0 ? void 0 : row.discord_user_id) || null });
    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getLink = getLink;
const setLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { discord_user_id } = req.body;
        if (!discord_user_id || typeof discord_user_id !== 'string') {
            return res.status(400).json({ message: 'discord_user_id is required' });
        }
        const trimmed = discord_user_id.trim();
        if (!/^[0-9]{5,30}$/.test(trimmed)) {
            return res.status(400).json({ message: 'Invalid Discord ID format' });
        }
        const db = yield (0, db_1.getDb)();
        yield db.run(`INSERT INTO discord_links (user_id, discord_user_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE discord_user_id = VALUES(discord_user_id)`, [req.user.id, trimmed]);
        res.json({ ok: true, discord_user_id: trimmed });
    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.setLink = setLink;
