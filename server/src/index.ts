import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import streamRoutes from './routes/streams';
import streamsMockRoutes from './routes/streamsMock';
import healthRoutes from './routes/health';
import twitchRoutes from './routes/twitch';
import redmRoutes from './routes/redm';
import liveRoutes from './routes/live';
import discordRoutes from './routes/discord';
import ownerRoutes from './routes/owner';
import staffRoutes from './routes/staff';
import { eventsubWebhook } from './controllers/twitchController';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

// Twitch EventSub webhook must be mounted with raw body BEFORE json parser
app.post('/api/twitch/eventsub/webhook', express.raw({ type: 'application/json' }), eventsubWebhook);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/streams/mock', streamsMockRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/twitch', twitchRoutes);
app.use('/api/redm', redmRoutes);
app.use('/api/live', liveRoutes);
console.log('Mounting Discord routes at /api/discord');
app.use('/api/discord', discordRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/staff', staffRoutes);

app.get('/', (req, res) => {
  res.send('StreamPulse API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
