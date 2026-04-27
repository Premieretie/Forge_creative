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
exports.getDb = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let pool = null;
let adapter = null;
function getPool() {
    if (pool)
        return pool;
    const host = process.env.MYSQL_HOST || 'localhost';
    const port = Number(process.env.MYSQL_PORT || 3306);
    const user = process.env.MYSQL_USER || 'root';
    const password = process.env.MYSQL_PASSWORD || 'LetHerRip69!';
    const database = process.env.MYSQL_DATABASE || 'rsg_dev';
    pool = promise_1.default.createPool({
        host,
        port,
        user,
        password,
        database,
        connectionLimit: 10,
        multipleStatements: true,
    });
    return pool;
}
const getDb = () => __awaiter(void 0, void 0, void 0, function* () {
    if (adapter)
        return adapter;
    const p = getPool();
    const query = (sql_1, ...args_1) => __awaiter(void 0, [sql_1, ...args_1], void 0, function* (sql, params = []) {
        const [rows] = yield p.query(sql, params);
        return rows;
    });
    adapter = {
        get: (sql_1, ...args_1) => __awaiter(void 0, [sql_1, ...args_1], void 0, function* (sql, params = []) {
            var _a;
            const rows = yield query(sql, params);
            return Array.isArray(rows) ? ((_a = rows[0]) !== null && _a !== void 0 ? _a : null) : rows;
        }),
        all: (sql_1, ...args_1) => __awaiter(void 0, [sql_1, ...args_1], void 0, function* (sql, params = []) {
            const rows = yield query(sql, params);
            return Array.isArray(rows) ? rows : [];
        }),
        run: (sql_1, ...args_1) => __awaiter(void 0, [sql_1, ...args_1], void 0, function* (sql, params = []) {
            const [result] = yield p.execute(sql, params);
            return {
                lastID: result === null || result === void 0 ? void 0 : result.insertId,
                changes: result === null || result === void 0 ? void 0 : result.affectedRows,
            };
        }),
        exec: (sql) => __awaiter(void 0, void 0, void 0, function* () {
            yield p.query(sql);
        }),
    };
    return adapter;
});
exports.getDb = getDb;
