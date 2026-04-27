import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

type DbAdapter = {
  get: (sql: string, params?: any[]) => Promise<any>;
  all: (sql: string, params?: any[]) => Promise<any[]>;
  run: (sql: string, params?: any[]) => Promise<{ lastID?: number; changes?: number }>;
  exec: (sql: string) => Promise<void>;
};

let pool: mysql.Pool | null = null;
let adapter: DbAdapter | null = null;

function getPool(): mysql.Pool {
  if (pool) return pool;
  const host = process.env.MYSQL_HOST || 'localhost';
  const port = Number(process.env.MYSQL_PORT || 3306);
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || 'LetHerRip69!';
  const database = process.env.MYSQL_DATABASE || 'rsg_dev';

  pool = mysql.createPool({
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

export const getDb = async (): Promise<DbAdapter> => {
  if (adapter) return adapter;
  const p = getPool();

  const query = async (sql: string, params: any[] = []) => {
    const [rows] = await p.query(sql, params);
    return rows as any[];
  };

  adapter = {
    get: async (sql: string, params: any[] = []) => {
      const rows = await query(sql, params);
      return Array.isArray(rows) ? (rows[0] ?? null) : rows;
    },
    all: async (sql: string, params: any[] = []) => {
      const rows = await query(sql, params);
      return Array.isArray(rows) ? rows : [];
    },
    run: async (sql: string, params: any[] = []) => {
      const [result]: any = await p.execute(sql, params);
      return {
        lastID: result?.insertId,
        changes: result?.affectedRows,
      };
    },
    exec: async (sql: string) => {
      await p.query(sql);
    },
  };

  return adapter;
};