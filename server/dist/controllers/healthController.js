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
exports.getHealthLogs = exports.logHealth = void 0;
const db_1 = require("../db");
const logHealth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, value, notes } = req.body;
        const db = yield (0, db_1.getDb)();
        if (!type || value === undefined) {
            return res.status(400).json({ message: 'Type and value are required' });
        }
        yield db.run('INSERT INTO health_logs (user_id, type, value, notes) VALUES (?, ?, ?, ?)', [req.user.id, type, value, notes]);
        res.status(201).json({ message: 'Log added successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.logHealth = logHealth;
const getHealthLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const db = yield (0, db_1.getDb)();
        let query = 'SELECT * FROM health_logs WHERE user_id = ?';
        const params = [req.user.id];
        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }
        query += ' ORDER BY logged_at DESC';
        const logs = yield db.all(query, params);
        res.json(logs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getHealthLogs = getHealthLogs;
