import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected route
router.post('/logout', authenticateToken, logout);

export default router;