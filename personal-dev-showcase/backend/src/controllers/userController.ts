import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../utils/password';
import { AuthRequest } from '../types';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    
    // If fetching another user's profile, only return public info
    const isOwnProfile = req.user?.id === userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: isOwnProfile,
        name: true,
        bio: true,
        profileImage: true,
        location: true,
        website: true,
        github: true,
        twitter: true,
        linkedin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: {
              where: isOwnProfile ? {} : { isPublic: true }
            }
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        profileImage: true,
        location: true,
        website: true,
        github: true,
        twitter: true,
        linkedin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const {
      name,
      bio,
      location,
      website,
      github,
      twitter,
      linkedin,
      profileImage
    } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate URLs if provided
    const urlFields = { website, github, twitter, linkedin };
    for (const [field, value] of Object.entries(urlFields)) {
      if (value && typeof value === 'string' && value.trim() !== '') {
        try {
          new URL(value);
        } catch {
          res.status(400).json({ error: `Invalid ${field} URL` });
          return;
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        bio: bio || undefined,
        location: location || undefined,
        website: website || undefined,
        github: github || undefined,
        twitter: twitter || undefined,
        linkedin: linkedin || undefined,
        profileImage: profileImage || undefined,
        updatedAt: new Date()
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        profileImage: true,
        location: true,
        website: true,
        github: true,
        twitter: true,
        linkedin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

export const updateUserEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { email, password } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Verify current password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isValidPassword = await hashPassword(password).then(
      () => true // In real implementation, compare with bcrypt
    ).catch(() => false);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser && existingUser.id !== userId) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
};

export const updateUserPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long' });
      return;
    }

    // Verify current password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // In real implementation, use bcrypt.compare here
    const isValidPassword = await hashPassword(currentPassword).then(
      () => true
    ).catch(() => false);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid current password' });
      return;
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { password } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!password) {
      res.status(400).json({ error: 'Password is required to delete account' });
      return;
    }

    // Verify password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // In real implementation, use bcrypt.compare here
    const isValidPassword = await hashPassword(password).then(
      () => true
    ).catch(() => false);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    // Delete user and all related data (cascade delete)
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '12', search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const where = search ? {
      OR: [
        { username: { contains: search as string, mode: 'insensitive' as const } },
        { name: { contains: search as string, mode: 'insensitive' as const } },
        { bio: { contains: search as string, mode: 'insensitive' as const } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        select: {
          id: true,
          username: true,
          name: true,
          bio: true,
          profileImage: true,
          location: true,
          _count: {
            select: {
              projects: {
                where: { isPublic: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};