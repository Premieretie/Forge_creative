import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { syncTwitchData, getStreams } from '../controllers/streamController';

const router = Router();

router.post('/sync', authenticateToken, syncTwitchData);
router.get('/', authenticateToken, getStreams);

export default router;
