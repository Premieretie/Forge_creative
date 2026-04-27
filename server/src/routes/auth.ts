import { Router } from 'express';
import { register, login, discordLogin } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/discord-login', discordLogin);

export default router;
