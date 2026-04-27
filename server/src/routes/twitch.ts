import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getOauthUrl, oauthCallback, linkPlayerIdentifier, routerWithRaw } from '../controllers/twitchController';

const router = express.Router();

router.get('/oauth/url', authenticateToken, getOauthUrl);
router.get('/oauth/callback', oauthCallback);
router.post('/link-player', authenticateToken, linkPlayerIdentifier);

router.use('/', routerWithRaw());

export default router;
