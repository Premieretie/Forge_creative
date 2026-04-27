import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getDb } from '../db';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const user = await db.get(
      `SELECT u.id, u.email, u.display_name, u.twitch_user_id, ta.twitch_display_name, u.created_at
       FROM users u
       LEFT JOIN twitch_accounts ta ON ta.user_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { display_name } = req.body;
    const db = await getDb();

    await db.run(
      'UPDATE users SET display_name = ? WHERE id = ?',
      [display_name, req.user.id]
    );

    const updatedUser = await db.get(
      `SELECT u.id, u.email, u.display_name, u.twitch_user_id, ta.twitch_display_name, u.created_at
       FROM users u
       LEFT JOIN twitch_accounts ta ON ta.user_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const linkTwitch = async (req: AuthRequest, res: Response) => {
  // Mock Twitch linking for MVP
  try {
    const db = await getDb();
    const mockTwitchId = `twitch_${Math.floor(Math.random() * 100000)}`;
    
    await db.run(
      'UPDATE users SET twitch_user_id = ?, twitch_access_token = ?, twitch_refresh_token = ? WHERE id = ?',
      [mockTwitchId, 'mock_access_token', 'mock_refresh_token', req.user.id]
    );

    const updatedUser = await db.get(
      `SELECT u.id, u.email, u.display_name, u.twitch_user_id, ta.twitch_display_name, u.created_at
       FROM users u
       LEFT JOIN twitch_accounts ta ON ta.user_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
