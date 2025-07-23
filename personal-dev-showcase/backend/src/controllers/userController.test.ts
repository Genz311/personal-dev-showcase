import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../types';
import {
  getUserProfile,
  getCurrentUser,
  updateUserProfile,
  deleteUser,
  getUsers
} from './userController';

// Mock Prisma
jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));

// Mock password utils
jest.mock('../utils/password', () => ({
  hashPassword: jest.fn((password: string) => Promise.resolve(`hashed_${password}`))
}));

describe('UserController', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    mockRequest = {
      params: {},
      body: {},
      query: {},
      user: { id: 'user123', email: 'test@example.com', username: 'testuser' }
    };
    mockResponse = {
      json: responseJson,
      status: responseStatus
    };
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should return user profile for authenticated user viewing own profile', async () => {
      const mockUser = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        bio: 'Test bio',
        profileImage: null,
        location: 'Test Location',
        website: 'https://test.com',
        github: 'https://github.com/testuser',
        twitter: null,
        linkedin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { projects: 5 }
      };

      mockRequest.params = { id: 'user123' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await getUserProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user123' },
        select: expect.objectContaining({
          email: true
        })
      });
      expect(responseJson).toHaveBeenCalledWith(mockUser);
    });

    it('should return limited profile for unauthenticated user', async () => {
      const mockUser = {
        id: 'user456',
        username: 'otheruser',
        email: undefined,
        name: 'Other User',
        bio: 'Other bio',
        profileImage: null,
        location: 'Other Location',
        website: null,
        github: 'https://github.com/otheruser',
        twitter: null,
        linkedin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { projects: 3 }
      };

      mockRequest.params = { id: 'user456' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await getUserProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user456' },
        select: expect.objectContaining({
          email: false
        })
      });
      expect(responseJson).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await getUserProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user profile', async () => {
      const mockUser = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        bio: 'Test bio',
        profileImage: null,
        location: 'Test Location',
        website: 'https://test.com',
        github: 'https://github.com/testuser',
        twitter: null,
        linkedin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await getCurrentUser(mockRequest as AuthRequest, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user123' },
        select: expect.any(Object)
      });
      expect(responseJson).toHaveBeenCalledWith(mockUser);
    });

    it('should return 401 if not authenticated', async () => {
      mockRequest.user = undefined;

      await getCurrentUser(mockRequest as AuthRequest, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        bio: 'Updated bio',
        location: 'New Location',
        website: 'https://newsite.com',
        github: 'https://github.com/updated',
        twitter: 'https://twitter.com/updated',
        linkedin: 'https://linkedin.com/in/updated'
      };

      const mockUpdatedUser = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        ...updateData,
        profileImage: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRequest.body = updateData;
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      await updateUserProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: expect.objectContaining({
          name: 'Updated Name',
          bio: 'Updated bio',
          location: 'New Location',
          website: 'https://newsite.com',
          github: 'https://github.com/updated',
          twitter: 'https://twitter.com/updated',
          linkedin: 'https://linkedin.com/in/updated'
        }),
        select: expect.any(Object)
      });
      expect(responseJson).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('should validate URLs', async () => {
      mockRequest.body = {
        website: 'invalid-url'
      };

      await updateUserProfile(mockRequest as AuthRequest, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Invalid website URL' });
    });
  });

  describe('getUsers', () => {
    it('should return paginated users list', async () => {
      const mockUsers = [
        {
          id: 'user1',
          username: 'user1',
          name: 'User One',
          bio: 'Bio 1',
          profileImage: null,
          location: 'Location 1',
          _count: { projects: 3 }
        },
        {
          id: 'user2',
          username: 'user2',
          name: 'User Two',
          bio: 'Bio 2',
          profileImage: null,
          location: 'Location 2',
          _count: { projects: 5 }
        }
      ];

      mockRequest.query = { page: '1', limit: '12' };
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
      (prisma.user.count as jest.Mock).mockResolvedValue(2);

      await getUsers(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 12,
        select: expect.objectContaining({
          id: true,
          username: true,
          name: true,
          bio: true,
          profileImage: true,
          location: true,
          _count: expect.any(Object)
        }),
        orderBy: { createdAt: 'desc' }
      });

      expect(responseJson).toHaveBeenCalledWith({
        users: mockUsers,
        pagination: {
          total: 2,
          page: 1,
          limit: 12,
          totalPages: 1
        }
      });
    });

    it('should filter users by search query', async () => {
      mockRequest.query = { search: 'test' };
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.user.count as jest.Mock).mockResolvedValue(0);

      await getUsers(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { username: { contains: 'test', mode: 'insensitive' } },
            { name: { contains: 'test', mode: 'insensitive' } },
            { bio: { contains: 'test', mode: 'insensitive' } }
          ]
        },
        skip: 0,
        take: 12,
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user account with valid password', async () => {
      mockRequest.body = { password: 'validpassword' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        password: 'hashed_password'
      });
      (prisma.user.delete as jest.Mock).mockResolvedValue({});

      await deleteUser(mockRequest as AuthRequest, mockResponse as Response);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'user123' }
      });
      expect(responseJson).toHaveBeenCalledWith({ message: 'Account deleted successfully' });
    });

    it('should return 400 if password not provided', async () => {
      mockRequest.body = {};

      await deleteUser(mockRequest as AuthRequest, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Password is required to delete account' });
    });
  });
});