import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const searchProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      q, 
      technologies, 
      page = '1', 
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      userId 
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const offset = (pageNum - 1) * limitNum;

    const where: any = {
      isPublic: true,
    };

    // Search by keyword in title, description
    if (q) {
      where.OR = [
        { title: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } },
      ];
    }

    // Filter by technologies
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

    // Filter by user
    if (userId) {
      where.userId = userId as string;
    }

    // Validate sort parameters
    const validSortFields = ['createdAt', 'updatedAt', 'title'];
    const validSortOrders = ['asc', 'desc'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
    const order = validSortOrders.includes(sortOrder as string) ? sortOrder as 'asc' | 'desc' : 'desc';

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
        orderBy: { [sortField]: order },
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
      filters: {
        query: q,
        technologies: technologies ? (Array.isArray(technologies) ? technologies : [technologies]) : undefined,
        sortBy: sortField,
        sortOrder: order,
        userId,
      },
    });
  } catch (error) {
    console.error('Search projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTechnologies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;

    const where: any = {};
    
    if (search) {
      where.name = {
        contains: search as string,
        mode: 'insensitive' as any,
      };
    }

    const technologies = await prisma.technology.findMany({
      where,
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: [
        { projects: { _count: 'desc' } }, // Most used first
        { name: 'asc' }, // Then alphabetically
      ],
      take: 50, // Limit to prevent too many results
    });

    res.json(technologies);
  } catch (error) {
    console.error('Get technologies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProjectStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalProjects, totalUsers, totalTechnologies, publicProjects] = await Promise.all([
      prisma.project.count(),
      prisma.user.count(),
      prisma.technology.count(),
      prisma.project.count({ where: { isPublic: true } }),
    ]);

    const topTechnologies = await prisma.technology.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: {
        projects: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    res.json({
      stats: {
        totalProjects,
        totalUsers,
        totalTechnologies,
        publicProjects,
      },
      topTechnologies,
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};