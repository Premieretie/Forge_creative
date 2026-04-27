import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { logHealth, getHealthLogs } from '../controllers/healthController';

const router = Router();

router.post('/', authenticateToken, logHealth);
router.get('/', authenticateToken, getHealthLogs);

export default router;
