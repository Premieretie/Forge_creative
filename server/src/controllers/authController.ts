import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fetch } from 'undici';
import { getDb } from '../db';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const db = await getDb();

    // Check if user exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await db.run(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, hashedPassword]
    );

    // Get created user
    const user = await db.get('SELECT id, email, created_at FROM users WHERE id = ?', [result.lastID]);

    // Create token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d',
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const db = await getDb();

    // Check user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d',
    });

    res.json({
      id: user.id,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const discordLogin = async (req: Request, res: Response) => {
  try {
    const { code, redirect_uri } = req.body;
    
    if (!code) return res.status(400).json({ message: 'Code is required' });

    // 1. Exchange code for token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirect_uri || process.env.DISCORD_REDIRECT_URI!
      }).toString()
    });

    if (!tokenResponse.ok) {
        const err = await tokenResponse.json();
        console.error('Discord Token Error:', err);
        return res.status(400).json({ message: 'Failed to authenticate with Discord' });
    }

    const tokenData: any = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Get User Info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!userResponse.ok) {
        return res.status(400).json({ message: 'Failed to fetch Discord profile' });
    }

    const discordUser: any = await userResponse.json();
    const { id: discordId, email, username, discriminator, global_name } = discordUser;

    if (!email) {
        return res.status(400).json({ message: 'Discord account must have a verified email' });
    }

    const db = await getDb();

    // 3. Check if we already have this discord ID linked
    let userId: number | null = null;
    const existingLink = await db.get('SELECT user_id FROM discord_links WHERE discord_user_id = ?', [discordId]);
    
    if (existingLink) {
        userId = existingLink.user_id;
    } else {
        // 4. Check if email exists
        const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
        
        if (existingUser) {
            userId = existingUser.id;
            // Link it now
            await db.run('INSERT INTO discord_links (user_id, discord_user_id) VALUES (?, ?)', [userId, discordId]);
        } else {
            // 5. Create new user
            // We need a password hash because it's NOT NULL in schema. Generate a random one.
            const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);
            
            const displayName = global_name || username;

            const result = await db.run(
                'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
                [email, hashedPassword, displayName]
            );
            userId = result.lastID!;
            
            // Link Discord
            await db.run('INSERT INTO discord_links (user_id, discord_user_id) VALUES (?, ?)', [userId, discordId]);
        }
    }

    // 6. Generate Token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });

    // Get final user details for response
    const user = await db.get('SELECT id, email, display_name FROM users WHERE id = ?', [userId]);

    res.json({
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        token
    });

  } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Server error during Discord login' });
  }
};
