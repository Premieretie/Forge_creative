import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getDb } from '../db';

export const logHealth = async (req: AuthRequest, res: Response) => {
  try {
    const { type, value, notes } = req.body;
    const db = await getDb();

    if (!type || value === undefined) {
      return res.status(400).json({ message: 'Type and value are required' });
    }

    await db.run(
      'INSERT INTO health_logs (user_id, type, value, notes) VALUES (?, ?, ?, ?)',
      [req.user.id, type, value, notes]
    );

    res.status(201).json({ message: 'Log added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHealthLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.query;
    const db = await getDb();
    
    let query = 'SELECT * FROM health_logs WHERE user_id = ?';
    const params = [req.user.id];

    if (type) {
      query += ' AND type = ?';
      params.push(type as string);
    }

    query += ' ORDER BY logged_at DESC';

    const logs = await db.all(query, params);
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
