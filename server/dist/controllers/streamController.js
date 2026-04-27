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
exports.mockStop = exports.mockStart = exports.getStreams = exports.syncTwitchData = void 0;
const db_1 = require("../db");
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
const syncTwitchData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, db_1.getDb)();
        const userId = req.user.id;
        // Check if user is linked to Twitch
        const user = yield db.get('SELECT twitch_user_id FROM users WHERE id = ?', [userId]);
        if (!user || !user.twitch_user_id) {
            return res.status(400).json({ message: 'Twitch account not linked' });
        }
        // Generate mock streams for the last 7 days
        const categories = ['Just Chatting', 'Valorant', 'Minecraft', 'League of Legends'];
        const platforms = ['Twitch'];
        // Clear existing streams for demo purposes to avoid duplicates on multiple syncs
        yield db.run('DELETE FROM streams WHERE user_id = ?', [userId]);
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
                yield db.run(`INSERT INTO streams (user_id, title, category, platform, duration_minutes, started_at, ended_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                    userId,
                    `Stream Day ${i + 1} - ${category}`,
                    category,
                    platform,
                    duration,
                    startTime,
                    endTime
                ]);
            }
        }
        res.json({ message: 'Stream data synced successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.syncTwitchData = syncTwitchData;
const getStreams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, db_1.getDb)();
        const streams = yield db.all('SELECT * FROM streams WHERE user_id = ? ORDER BY started_at DESC', [req.user.id]);
        res.json(streams);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getStreams = getStreams;
const mockStart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, db_1.getDb)();
        const userId = req.user.id;
        const active = yield db.get('SELECT id FROM streams WHERE user_id = ? AND ended_at IS NULL ORDER BY started_at DESC LIMIT 1', [userId]);
        if (active) {
            return res.status(400).json({ message: 'A test stream is already active' });
        }
        const { title, category, platform } = req.body || {};
        const now = new Date();
        const startedAt = toMySQLDateTime(now);
        yield db.run(`INSERT INTO streams (user_id, title, category, platform, duration_minutes, started_at, ended_at)
       VALUES (?, ?, ?, ?, ?, ?, NULL)`, [
            userId,
            title || 'Testing Stream - Redm Diablo County Rp',
            category || 'Redm Diablo County Rp',
            platform || 'Test',
            null,
            startedAt
        ]);
        res.status(201).json({ message: 'Test stream started' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.mockStart = mockStart;
const mockStop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, db_1.getDb)();
        const userId = req.user.id;
        const active = yield db.get('SELECT id, started_at FROM streams WHERE user_id = ? AND ended_at IS NULL ORDER BY started_at DESC LIMIT 1', [userId]);
        if (!active) {
            return res.status(400).json({ message: 'No active test stream to stop' });
        }
        const now = new Date();
        const startedAt = new Date(active.started_at);
        const minutes = Math.max(1, Math.round((now.getTime() - startedAt.getTime()) / 60000));
        yield db.run('UPDATE streams SET ended_at = ?, duration_minutes = ? WHERE id = ?', [toMySQLDateTime(now), minutes, active.id]);
        res.json({ message: 'Test stream stopped', duration_minutes: minutes });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.mockStop = mockStop;
