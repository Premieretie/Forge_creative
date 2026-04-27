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
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const db = yield (0, db_1.getDb)();
        // Check if user exists
        const existingUser = yield db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create user
        const result = yield db.run('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hashedPassword]);
        // Get created user
        const user = yield db.get('SELECT id, email, created_at FROM users WHERE id = ?', [result.lastID]);
        // Create token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '30d',
        });
        res.status(201).json({
            id: user.id,
            email: user.email,
            token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const db = yield (0, db_1.getDb)();
        // Check user
        const user = yield db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Create token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '30d',
        });
        res.json({
            id: user.id,
            email: user.email,
            token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
