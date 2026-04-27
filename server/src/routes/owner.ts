import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  registerCommunity, 
  getMyCommunities, 
  getCommunityMembers, 
  getCommunityPerks, 
  upsertPerk, 
  deletePerk,
  getGuildRoles,
  getStaffRoles,
  addStaffRole,
  removeStaffRole,
  getSettings,
  updateSettings,
  getTicketQueue,
  reviewTicket,
  testRoleAssignment
} from '../controllers/ownerController';

const router = Router();

// Communities management
router.post('/register', authenticateToken, registerCommunity);
router.get('/list', authenticateToken, getMyCommunities);

// Members
router.get('/:guild_id/members', authenticateToken, getCommunityMembers);

// Perks
router.get('/:guild_id/perks', authenticateToken, getCommunityPerks);
router.post('/:guild_id/perks', authenticateToken, upsertPerk);
router.delete('/:guild_id/perks/:reward_key', authenticateToken, deletePerk);

// Discord Roles
router.get('/:guild_id/roles', authenticateToken, getGuildRoles);
router.post('/:guild_id/roles/test', authenticateToken, testRoleAssignment);

// Staff Management
router.get('/:guild_id/staff-roles', authenticateToken, getStaffRoles);
router.post('/:guild_id/staff-roles', authenticateToken, addStaffRole);
router.delete('/:guild_id/staff-roles/:role_id', authenticateToken, removeStaffRole);

router.get('/:guild_id/settings', authenticateToken, getSettings);
router.put('/:guild_id/settings', authenticateToken, updateSettings);

// Ticket Review
router.get('/:guild_id/tickets', authenticateToken, getTicketQueue);
router.post('/:guild_id/tickets/:ticket_id/review', authenticateToken, reviewTicket);

export default router;
