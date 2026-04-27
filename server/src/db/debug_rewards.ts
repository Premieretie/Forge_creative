
import { getDb } from './index';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

(async () => {
  try {
    const db = await getDb();
    console.log('--- Debugging Data ---');
    
    // 1. Users
    const users = await db.all('SELECT id, display_name, email FROM users');
    console.log('Users:', users);
    const userId = users[0]?.id;

    if (!userId) {
        console.log('No users found.');
        return;
    }

    // 2. Discord Links
    const links = await db.all('SELECT * FROM discord_links WHERE user_id = ?', [userId]);
    console.log('Discord Links:', links);

    // 3. User Communities
    const comms = await db.all('SELECT * FROM user_communities WHERE user_id = ?', [userId]);
    console.log('User Communities:', comms);

    // 4. Reward Tiers
    const tiers = await db.all('SELECT * FROM reward_tiers');
    console.log('Reward Tiers:', tiers);

    // 5. Recent Streams (last 5)
    const streams = await db.all('SELECT id, title, category, duration_minutes, started_at, ended_at FROM streams WHERE user_id = ? ORDER BY id DESC LIMIT 5', [userId]);
    console.log('Recent Streams:', streams);

    // 6. Recent Twitch Sessions (last 5)
    const sessions = await db.all('SELECT id, twitch_user_id, duration_minutes, processed, guild_id, started_at, ended_at FROM twitch_stream_sessions WHERE user_id = ? ORDER BY id DESC LIMIT 5', [userId]);
    console.log('Recent Twitch Sessions:', sessions);

    // 7. Granted Rewards
    const granted = await db.all('SELECT * FROM granted_rewards WHERE user_id = ?', [userId]);
    console.log('Granted Rewards:', granted);

  } catch (e) {
    console.error('Script error:', e);
  }
})();
