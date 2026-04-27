
import { getDb } from './index';

async function migrate() {
  console.log('Starting migration for Community Owners...');
  const db = await getDb();

  try {
    // 1. Create communities table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS communities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        guild_id VARCHAR(30) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        owner_user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_communities_owner FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('Created communities table.');

    // 2. Update reward_tiers table
    // Check if guild_id column exists
    try {
        await db.exec('SELECT guild_id FROM reward_tiers LIMIT 1');
        console.log('reward_tiers already has guild_id column.');
    } catch (e) {
        console.log('Adding guild_id to reward_tiers...');
        await db.exec('ALTER TABLE reward_tiers ADD COLUMN guild_id VARCHAR(30) NULL');
        
        // Drop old unique index if it exists and add new composite one
        try {
            await db.exec('ALTER TABLE reward_tiers DROP INDEX uk_reward_key');
        } catch (err) {
            // Index might not exist or be named differently, ignore safely
            console.log('Note: Could not drop uk_reward_key (might not exist).');
        }
        
        await db.exec('ALTER TABLE reward_tiers ADD UNIQUE KEY uk_guild_reward (guild_id, reward_key)');
        console.log('Updated reward_tiers schema.');
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
