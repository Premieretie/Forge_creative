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
exports.startGoLive = void 0;
const undici_1 = require("undici");
const db_1 = require("../db");
const startGoLive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, message, guild_id } = req.body;
        const db = yield (0, db_1.getDb)();
        const userRow = yield db.get('SELECT id, twitch_user_id FROM users WHERE id = ?', [req.user.id]);
        if (!userRow || !userRow.twitch_user_id)
            return res.status(400).json({ message: 'Twitch not linked' });
        const acc = yield db.get('SELECT twitch_login FROM twitch_accounts WHERE twitch_user_id = ? LIMIT 1', [userRow.twitch_user_id]);
        const twitchLogin = acc === null || acc === void 0 ? void 0 : acc.twitch_login;
        const twitchUrl = twitchLogin ? `https://twitch.tv/${twitchLogin}` : '';
        let channelIdToUse = null;
        let guildIdToUse = null;
        if (guild_id && /^[0-9]{5,30}$/.test(guild_id)) {
            const comm = yield db.get('SELECT go_live_channel_id FROM user_communities WHERE user_id = ? AND guild_id = ? LIMIT 1', [req.user.id, guild_id]);
            guildIdToUse = guild_id;
            if (comm === null || comm === void 0 ? void 0 : comm.go_live_channel_id)
                channelIdToUse = String(comm.go_live_channel_id);
        }
        yield db.run('INSERT INTO go_live_events (user_id, twitch_user_id, title, message, guild_id, channel_id) VALUES (?, ?, ?, ?, ?, ?)', [req.user.id, userRow.twitch_user_id, title || null, message || null, guildIdToUse, channelIdToUse]);
        const token = process.env.DISCORD_BOT_TOKEN;
        const channelId = channelIdToUse || process.env.DISCORD_CHANNEL_ID || '1251348093052518441';
        if (token && channelId) {
            const parts = [];
            if (title)
                parts.push(`**${title}**`);
            if (message)
                parts.push(message);
            if (twitchUrl)
                parts.push(twitchUrl);
            const content = parts.join('\n');
            try {
                yield (0, undici_1.fetch)(`https://discord.com/api/v10/channels/${channelId}/messages`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bot ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content }),
                });
            }
            catch (_a) { }
        }
        res.json({ ok: true });
    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.startGoLive = startGoLive;
