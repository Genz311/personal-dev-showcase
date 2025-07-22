import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const decoded = verifyAccessToken(token);
    
    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuthentication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // No token provided, but that's okay for optional auth
      next();
      return;
    }

    const decoded = verifyAccessToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true },
    });

    if (user) {
      req.user = {
        userId: user.id,
        email: user.email,
        username: user.username,
      };
    }

    next();
  } catch (error) {
    // Token is invalid, but continue without auth
    next();
  }
};