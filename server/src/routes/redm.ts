import express from 'express';
import { getEntitlements } from '../controllers/redmController';

const router = express.Router();

router.get('/entitlements', getEntitlements);

export default router;
