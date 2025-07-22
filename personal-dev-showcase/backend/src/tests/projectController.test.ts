import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  createProject,
  getProjects,
  getProjectById,
  getUserProjects,
  updateProject,
  deleteProject,
} from '../controllers/projectController';

// Mock Prisma
jest.mock('../lib/prisma', () => ({
  prisma: {
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// Import after mocking
import { prisma } from '../lib/prisma';
const mockPrisma = prisma as any;

describe('Project Controller', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      user: { userId: 'user1', email: 'test@example.com', username: 'testuser' },
      body: {},
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a new project successfully', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'Test description',
        technologies: ['javascript', 'react'],
        isPublic: true,
      };
      req.body = projectData;

      const mockProject = {
        id: 'project1',
        ...projectData,
        userId: 'user1',
        technologies: [
          { id: 'tech1', name: 'javascript' },
          { id: 'tech2', name: 'react' },
        ],
        user: {
          id: 'user1',
          username: 'testuser',
          displayName: 'Test User',
          avatarUrl: null,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.project.create.mockResolvedValue(mockProject);

      await createProject(req as AuthRequest, res as Response);

      expect(mockPrisma.project.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Project',
          description: 'Test description',
          githubUrl: null,
          liveUrl: null,
          imageUrl: null,
          isPublic: true,
          userId: 'user1',
          technologies: {
            connectOrCreate: [
              { where: { name: 'javascript' }, create: { name: 'javascript' } },
              { where: { name: 'react' }, create: { name: 'react' } },
            ],
          },
        },
        include: {
          technologies: true,
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProject);
    });

    it('should return 401 if user is not authenticated', async () => {
      req.user = undefined;

      await createProject(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' });
    });

    it('should return 400 if title or description is missing', async () => {
      req.body = { title: '', description: 'Test description' };

      await createProject(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Title and description are required' });
    });
  });

  describe('getProjects', () => {
    it('should return paginated public projects', async () => {
      const mockProjects = [
        {
          id: 'project1',
          title: 'Project 1',
          description: 'Description 1',
          isPublic: true,
          technologies: [{ id: 'tech1', name: 'javascript' }],
          user: { id: 'user1', username: 'user1', displayName: 'User 1', avatarUrl: null },
          createdAt: new Date(),
        },
      ];

      mockPrisma.project.findMany.mockResolvedValue(mockProjects);
      mockPrisma.project.count.mockResolvedValue(1);

      await getProjects(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({
        projects: mockProjects,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      });
    });
  });

  describe('getProjectById', () => {
    it('should return a project by ID', async () => {
      req.params = { id: 'project1' };
      const mockProject = {
        id: 'project1',
        title: 'Test Project',
        description: 'Test description',
        isPublic: true,
        technologies: [],
        user: { id: 'user1', username: 'user1', displayName: 'User 1' },
      };

      mockPrisma.project.findUnique.mockResolvedValue(mockProject);

      await getProjectById(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(mockProject);
    });

    it('should return 404 if project not found', async () => {
      req.params = { id: 'nonexistent' };
      mockPrisma.project.findUnique.mockResolvedValue(null);

      await getProjectById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Project not found' });
    });
  });

  describe('getUserProjects', () => {
    it('should return all projects for authenticated user', async () => {
      const mockProjects = [
        {
          id: 'project1',
          title: 'User Project 1',
          userId: 'user1',
          technologies: [],
        },
      ];

      mockPrisma.project.findMany.mockResolvedValue(mockProjects);

      await getUserProjects(req as AuthRequest, res as Response);

      expect(res.json).toHaveBeenCalledWith(mockProjects);
    });

    it('should return 401 if user is not authenticated', async () => {
      req.user = undefined;

      await getUserProjects(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' });
    });
  });

  describe('updateProject', () => {
    it('should update project successfully', async () => {
      req.params = { id: 'project1' };
      req.body = {
        title: 'Updated Project',
        description: 'Updated description',
        technologies: ['javascript'],
      };

      const existingProject = { userId: 'user1' };
      const updatedProject = {
        id: 'project1',
        title: 'Updated Project',
        description: 'Updated description',
        userId: 'user1',
        technologies: [{ id: 'tech1', name: 'javascript' }],
        user: { id: 'user1', username: 'user1', displayName: 'User 1', avatarUrl: null },
      };

      mockPrisma.project.findUnique.mockResolvedValue(existingProject);
      mockPrisma.project.update.mockResolvedValue(updatedProject);

      await updateProject(req as AuthRequest, res as Response);

      expect(res.json).toHaveBeenCalledWith(updatedProject);
    });

    it('should return 404 if project not found', async () => {
      req.params = { id: 'nonexistent' };
      mockPrisma.project.findUnique.mockResolvedValue(null);

      await updateProject(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Project not found' });
    });
  });

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      req.params = { id: 'project1' };
      const existingProject = { userId: 'user1' };

      mockPrisma.project.findUnique.mockResolvedValue(existingProject);
      mockPrisma.project.delete.mockResolvedValue({});

      await deleteProject(req as AuthRequest, res as Response);

      expect(res.json).toHaveBeenCalledWith({ message: 'Project deleted successfully' });
    });

    it('should return 404 if project not found', async () => {
      req.params = { id: 'nonexistent' };
      mockPrisma.project.findUnique.mockResolvedValue(null);

      await deleteProject(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Project not found' });
    });
  });
});