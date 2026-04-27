import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { mockStart, mockStop } from '../controllers/streamController';

const router = Router();

router.post('/start', authenticateToken, mockStart);
router.post('/stop', authenticateToken, mockStop);

export default router;
