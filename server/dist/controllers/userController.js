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
exports.linkTwitch = exports.updateProfile = exports.getProfile = void 0;
const db_1 = require("../db");
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, db_1.getDb)();
        const user = yield db.get(`SELECT u.id, u.email, u.display_name, u.twitch_user_id, ta.twitch_display_name, u.created_at
       FROM users u
       LEFT JOIN twitch_accounts ta ON ta.user_id = u.id
       WHERE u.id = ?`, [req.user.id]);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { display_name } = req.body;
        const db = yield (0, db_1.getDb)();
        yield db.run('UPDATE users SET display_name = ? WHERE id = ?', [display_name, req.user.id]);
        const updatedUser = yield db.get(`SELECT u.id, u.email, u.display_name, u.twitch_user_id, ta.twitch_display_name, u.created_at
       FROM users u
       LEFT JOIN twitch_accounts ta ON ta.user_id = u.id
       WHERE u.id = ?`, [req.user.id]);
        res.json(updatedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateProfile = updateProfile;
const linkTwitch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Mock Twitch linking for MVP
    try {
        const db = yield (0, db_1.getDb)();
        const mockTwitchId = `twitch_${Math.floor(Math.random() * 100000)}`;
        yield db.run('UPDATE users SET twitch_user_id = ?, twitch_access_token = ?, twitch_refresh_token = ? WHERE id = ?', [mockTwitchId, 'mock_access_token', 'mock_refresh_token', req.user.id]);
        const updatedUser = yield db.get(`SELECT u.id, u.email, u.display_name, u.twitch_user_id, ta.twitch_display_name, u.created_at
       FROM users u
       LEFT JOIN twitch_accounts ta ON ta.user_id = u.id
       WHERE u.id = ?`, [req.user.id]);
        res.json(updatedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.linkTwitch = linkTwitch;
