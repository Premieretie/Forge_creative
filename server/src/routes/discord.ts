import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getConnections, getLink, getCommunities, upsertCommunity, deleteCommunity } from '../controllers/discordController';

const router = Router();

router.get('/connections', authenticateToken, getConnections);
router.get('/link', authenticateToken, getLink);
router.get('/communities', authenticateToken, getCommunities);
router.post('/communities', authenticateToken, upsertCommunity);
router.delete('/communities/:guild_id', authenticateToken, deleteCommunity);

export default router;
