
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getStaffCommunities, logTicket, getStaffStats } from '../controllers/staffController';

const router = Router();

// Get list of communities where user is staff
router.get('/communities', authenticateToken, getStaffCommunities);

// Log a new ticket
router.post('/tickets', authenticateToken, logTicket);

// Get stats for a specific community
router.get('/:guild_id/stats', authenticateToken, getStaffStats);

export default router;
