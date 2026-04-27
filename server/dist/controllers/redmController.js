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
exports.getEntitlements = void 0;
const db_1 = require("../db");
function requireApiKey(req) {
    const apiKey = req.header('x-api-key');
    const expected = process.env.REDM_API_KEY;
    return !!expected && apiKey === expected;
}
const getEntitlements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!requireApiKey(req))
            return res.status(401).json({ message: 'Unauthorized' });
        const identifier = req.query.identifier || '';
        if (!identifier)
            return res.status(400).json({ message: 'Missing identifier' });
        const db = yield (0, db_1.getDb)();
        const acc = yield db.get('SELECT user_id, twitch_user_id FROM twitch_accounts WHERE linked_player_identifier = ? LIMIT 1', [identifier]);
        if (!acc) {
            return res.json({ identifier, hours_total: 0, rewards: [] });
        }
        const totalMinutesRow = yield db.get('SELECT COALESCE(SUM(duration_minutes),0) AS minutes FROM twitch_stream_sessions WHERE user_id = ? AND processed = 1 AND duration_minutes >= 30', [acc.user_id]);
        const minutes = Number((totalMinutesRow === null || totalMinutesRow === void 0 ? void 0 : totalMinutesRow.minutes) || 0);
        const hours = Math.floor(minutes / 60);
        const rewards = yield db.all('SELECT reward_key, granted_at FROM granted_rewards WHERE user_id = ? ORDER BY granted_at ASC', [acc.user_id]);
        res.json({
            identifier,
            twitch_user_id: acc.twitch_user_id,
            hours_total: hours,
            rewards,
        });
    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getEntitlements = getEntitlements;
