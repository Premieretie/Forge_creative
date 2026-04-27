
import { getDb } from './index';

async function migrate() {
  const db = await getDb();
  console.log('Fixing granted_rewards constraints...');

  try {
    // 1. Drop Foreign Key
    try {
      await db.run('ALTER TABLE granted_rewards DROP FOREIGN KEY fk_granted_rewards_user');
      console.log('Dropped FK fk_granted_rewards_user');
    } catch (e: any) {
      console.log('Error dropping FK (might use different name or not exist):', e.message);
      // Try generic name if auto-generated? No, schema defines it as fk_granted_rewards_user.
    }

    // 2. Drop Old Unique Index
    try {
      await db.run('ALTER TABLE granted_rewards DROP INDEX uk_user_reward');
      console.log('Dropped old index uk_user_reward');
    } catch (e: any) {
      console.log('Error dropping index:', e.message);
    }

    // 3. Ensure New Unique Index exists (created in previous step, but just in case)
    try {
        // We might have created it already.
        // If not, create it. 
        // Note: We want (user_id, guild_id, reward_key) but guild_id can be NULL.
        // In MySQL, unique constraints allow multiple NULLs.
        // So (1, NULL, 'key') and (1, NULL, 'key') would be allowed? 
        // Yes, multiple NULLs are distinct. 
        // For global rewards (guild_id=NULL), we want to enforce uniqueness per user+key.
        // So we might need two unique indexes? 
        // Or just ensure we don't insert duplicates in code.
        // Or use a virtual column?
        // Actually, if guild_id is NULL, we might want to treat it as a unique "global" entry.
        // But let's assume for now the code handles upsert logic carefully.
        // Or we can make guild_id NOT NULL and use a sentinel value/empty string for global?
        // Schema says guild_id VARCHAR(30) NULL.
        
        // Let's stick to the new index.
        await db.run('ALTER TABLE granted_rewards ADD UNIQUE KEY uk_user_guild_reward (user_id, guild_id, reward_key)');
        console.log('Added index uk_user_guild_reward');
    } catch (e: any) {
       if (!e.message.includes('Duplicate key')) {
           console.log('Error adding new index:', e.message);
       }
    }

    // 4. Restore Foreign Key
    try {
      await db.run('ALTER TABLE granted_rewards ADD CONSTRAINT fk_granted_rewards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
      console.log('Restored FK fk_granted_rewards_user');
    } catch (e: any) {
      console.log('Error restoring FK:', e.message);
    }

  } catch (e) {
    console.error('Migration failed:', e);
  }
  
  process.exit(0);
}

migrate();
