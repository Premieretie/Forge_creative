import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getProfile, updateProfile, linkTwitch } from '../controllers/userController';

const router = Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/link-twitch', authenticateToken, linkTwitch);

export default router;
