import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, imageUrl, isPublic = true } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!title || !description) {
      res.status(400).json({ error: 'Title and description are required' });
      return;
    }

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        githubUrl: githubUrl?.trim() || null,
        liveUrl: liveUrl?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isPublic,
        userId,
        technologies: {
          connectOrCreate: technologies?.map((tech: string) => ({
            where: { name: tech.toLowerCase() },
            create: { name: tech.toLowerCase() },
          })) || [],
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

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', search, technologies } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const offset = (pageNum - 1) * limitNum;

    const where: any = {
      isPublic: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (technologies) {
      const techArray = Array.isArray(technologies) ? technologies : [technologies];
      where.technologies = {
        some: {
          name: {
            in: techArray.map((tech) => String(tech).toLowerCase()),
          },
        },
      };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.project.count({ where }),
    ]);

    res.json({
      projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        technologies: true,
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            githubUrl: true,
            twitterUrl: true,
            websiteUrl: true,
          },
        },
      },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    if (!project.isPublic) {
      res.status(403).json({ error: 'Project is private' });
      return;
    }

    res.json(project);
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        technologies: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(projects);
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, technologies, githubUrl, liveUrl, imageUrl, isPublic } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingProject) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    if (existingProject.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to update this project' });
      return;
    }

    // Disconnect existing technologies and connect new ones
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: title?.trim(),
        description: description?.trim(),
        githubUrl: githubUrl?.trim() || null,
        liveUrl: liveUrl?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isPublic,
        technologies: {
          set: [], // Disconnect all existing
          connectOrCreate: technologies?.map((tech: string) => ({
            where: { name: tech.toLowerCase() },
            create: { name: tech.toLowerCase() },
          })) || [],
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

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingProject) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    if (existingProject.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to delete this project' });
      return;
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};