
import { grantRewardsIfEligible } from '../controllers/twitchController';
import { getDb } from '../db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

(async () => {
  try {
    const db = await getDb();
    console.log('Triggering reward check for user 5...');
    
    // User 5, Twitch ID 590450653, Guild 1111227384281186376
    await grantRewardsIfEligible(5, '590450653', '1111227384281186376');
    
    console.log('Check complete.');
    
    const granted = await db.all('SELECT * FROM granted_rewards WHERE user_id = 5');
    console.log('Granted Rewards:', granted);
    
  } catch (e) {
    console.error('Script error:', e);
  }
})();
