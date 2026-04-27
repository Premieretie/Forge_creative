
import { getDb } from './index';

async function migrate() {
  const db = await getDb();
  console.log('Migrating granted_rewards table...');

  try {
    // Add guild_id column
    // We use a try/catch block for the column addition in case it exists, 
    // but SQLite doesn't support IF NOT EXISTS for ADD COLUMN in older versions, 
    // though we can check if it exists first or just try/catch.
    // However, we also need to update the unique constraint.
    
    // 1. Add guild_id
    try {
      await db.run('ALTER TABLE granted_rewards ADD COLUMN guild_id VARCHAR(30) NULL');
      console.log('Added guild_id column to granted_rewards');
    } catch (e: any) {
      if (e.message.includes('duplicate column')) {
        console.log('guild_id column already exists in granted_rewards');
      } else {
        console.log('Error adding guild_id (might already exist):', e.message);
      }
    }

    // 2. Drop old unique index and add new one
    // SQLite doesn't support DROP INDEX directly on a constraint name easily without knowing the auto-generated name if it wasn't named explicitly?
    // Wait, in schema.sql: UNIQUE KEY uk_user_reward (user_id, reward_key)
    // In MySQL this is a named index. In SQLite, it might be an index.
    // The current environment uses `mysql2`, so it IS MySQL (based on previous context "Backend: Node.js... MySQL (mysql2)").
    // Wait, the code imports `getDb` which usually returns a sqlite db in some of these projects, but the summary said MySQL.
    // Let me double check `server/src/db/index.ts`.
    
    // Schema.sql uses MySQL syntax (INT AUTO_INCREMENT, ENGINE=InnoDB).
    // So it is MySQL.
    
    try {
      await db.run('ALTER TABLE granted_rewards DROP INDEX uk_user_reward');
      console.log('Dropped old unique index uk_user_reward');
    } catch (e: any) {
      console.log('Error dropping index (might not exist):', e.message);
    }

    try {
      await db.run('ALTER TABLE granted_rewards ADD UNIQUE KEY uk_user_guild_reward (user_id, guild_id, reward_key)');
      console.log('Added new unique index uk_user_guild_reward');
    } catch (e: any) {
      console.log('Error adding new index:', e.message);
    }

  } catch (e) {
    console.error('Migration failed:', e);
  }
  
  process.exit(0);
}

migrate();
