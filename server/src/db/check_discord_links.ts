
import { getDb } from './index';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

(async () => {
  try {
    const db = await getDb();
    console.log('Connected to DB');
    
    // Check table
    try {
        const result = await db.all('SELECT * FROM discord_links LIMIT 1');
        console.log('discord_links table exists. Rows:', result.length);
        if (result.length > 0) {
            console.log('Sample row:', result[0]);
        } else {
            console.log('Table is empty');
        }
    } catch (e: any) {
        console.error('Error querying discord_links:', e.message);
        
        // Try creating it if missing
        console.log('Attempting to create table...');
        await db.exec(`
            CREATE TABLE IF NOT EXISTS discord_links (
              user_id INT PRIMARY KEY,
              discord_user_id VARCHAR(30) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT fk_discord_links_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `);
        console.log('Table creation script ran.');
    }

  } catch (e) {
    console.error('Script error:', e);
  }
})();
