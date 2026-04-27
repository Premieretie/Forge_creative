import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { startGoLive } from '../controllers/liveController';

const router = express.Router();

router.post('/start', authenticateToken, startGoLive);

export default router;
