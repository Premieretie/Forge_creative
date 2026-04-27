import { getDb } from '../db';
import fs from 'fs';
import path from 'path';

async function migrate() {
  try {
    const db = await getDb();
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running migration...');
    await db.exec(schemaSql);
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
