
import { getDb } from './index';

async function run() {
  const db = await getDb();
  // Delete the Diablo Logs community
  await db.run('DELETE FROM user_communities WHERE guild_id = ?', ['1291906293740736512']);
  console.log('Deleted community 1291906293740736512');
  process.exit(0);
}

run();
