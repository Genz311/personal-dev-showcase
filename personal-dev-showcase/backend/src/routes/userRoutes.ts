import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getUserProfile,
  getCurrentUser,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  deleteUser,
  getUsers
} from '../controllers/userController';

const router = express.Router();

// Public routes
router.get('/', getUsers); // Get all users with pagination
router.get('/:id', getUserProfile); // Get specific user profile

// Protected routes
router.get('/me/profile', authenticateToken, getCurrentUser);
router.put('/me/profile', authenticateToken, updateUserProfile);
router.put('/me/email', authenticateToken, updateUserEmail);
router.put('/me/password', authenticateToken, updateUserPassword);
router.delete('/me', authenticateToken, deleteUser);

export default router;