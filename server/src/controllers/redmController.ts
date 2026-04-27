import { Request, Response } from 'express';
import { getDb } from '../db';

function requireApiKey(req: Request): boolean {
  const apiKey = req.header('x-api-key');
  const expected = process.env.REDM_API_KEY;
  return !!expected && apiKey === expected;
}

export const getEntitlements = async (req: Request, res: Response) => {
  try {
    if (!requireApiKey(req)) return res.status(401).json({ message: 'Unauthorized' });
    const identifier = (req.query.identifier as string) || '';
    if (!identifier) return res.status(400).json({ message: 'Missing identifier' });

    const db = await getDb();
    const acc = await db.get(
      'SELECT user_id, twitch_user_id FROM twitch_accounts WHERE linked_player_identifier = ? LIMIT 1',
      [identifier]
    );

    if (!acc) {
      return res.json({ identifier, hours_total: 0, rewards: [] });
    }

    const totalMinutesRow = await db.get(
      'SELECT COALESCE(SUM(duration_minutes),0) AS minutes FROM twitch_stream_sessions WHERE user_id = ? AND processed = 1 AND duration_minutes >= 30',
      [acc.user_id]
    );
    const minutes = Number(totalMinutesRow?.minutes || 0);
    const hours = Math.floor(minutes / 60);

    const rewards = await db.all(`
      SELECT 
        gr.reward_key, 
        gr.granted_at,
        rt.reward_type,
        rt.reward_value
      FROM granted_rewards gr
      LEFT JOIN reward_tiers rt ON rt.reward_key = gr.reward_key 
        AND (rt.guild_id = gr.guild_id OR (rt.guild_id IS NULL AND gr.guild_id IS NULL))
      WHERE gr.user_id = ? 
      ORDER BY gr.granted_at ASC
    `, [acc.user_id]);

    res.json({
      identifier,
      twitch_user_id: acc.twitch_user_id,
      hours_total: hours,
      rewards,
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
