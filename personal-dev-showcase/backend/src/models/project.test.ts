import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

describe('Project Model', () => {
  let testUser: any;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
        name: 'Test User',
      },
    });
  });

  describe('Project Creation', () => {
    it('should create a new project with required fields', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'A test project description',
        userId: testUser.id,
      };

      const project = await prisma.project.create({
        data: projectData,
      });

      expect(project).toBeDefined();
      expect(project.id).toBeDefined();
      expect(project.title).toBe(projectData.title);
      expect(project.description).toBe(projectData.description);
      expect(project.userId).toBe(testUser.id);
      expect(project.isPublic).toBe(true); // default value
      expect(project.featured).toBe(false); // default value
      expect(project.createdAt).toBeDefined();
      expect(project.updatedAt).toBeDefined();
    });

    it('should create a project with optional fields', async () => {
      const projectData = {
        title: 'Full Project',
        description: 'A complete project description',
        longDescription: 'A much longer description with more details',
        imageUrl: 'https://example.com/image.jpg',
        githubUrl: 'https://github.com/user/project',
        liveUrl: 'https://project.example.com',
        isPublic: false,
        featured: true,
        userId: testUser.id,
      };

      const project = await prisma.project.create({
        data: projectData,
      });

      expect(project.longDescription).toBe(projectData.longDescription);
      expect(project.imageUrl).toBe(projectData.imageUrl);
      expect(project.githubUrl).toBe(projectData.githubUrl);
      expect(project.liveUrl).toBe(projectData.liveUrl);
      expect(project.isPublic).toBe(false);
      expect(project.featured).toBe(true);
    });
  });

  describe('Project Relationships', () => {
    it('should include user data when queried', async () => {
      const project = await prisma.project.create({
        data: {
          title: 'Test Project',
          description: 'A test project description',
          userId: testUser.id,
        },
      });

      const projectWithUser = await prisma.project.findUnique({
        where: { id: project.id },
        include: { user: true },
      });

      expect(projectWithUser?.user).toBeDefined();
      expect(projectWithUser?.user.id).toBe(testUser.id);
      expect(projectWithUser?.user.username).toBe(testUser.username);
    });

    it('should cascade delete projects when user is deleted', async () => {
      // Create projects for the user
      await prisma.project.createMany({
        data: [
          {
            title: 'Project 1',
            description: 'Description 1',
            userId: testUser.id,
          },
          {
            title: 'Project 2',
            description: 'Description 2',
            userId: testUser.id,
          },
        ],
      });

      // Verify projects exist
      const projectsBeforeDelete = await prisma.project.findMany({
        where: { userId: testUser.id },
      });
      expect(projectsBeforeDelete).toHaveLength(2);

      // Delete user
      await prisma.user.delete({
        where: { id: testUser.id },
      });

      // Verify projects are also deleted
      const projectsAfterDelete = await prisma.project.findMany({
        where: { userId: testUser.id },
      });
      expect(projectsAfterDelete).toHaveLength(0);
    });
  });

  describe('Project Queries', () => {
    beforeEach(async () => {
      // Create test projects
      await prisma.project.createMany({
        data: [
          {
            title: 'Public Project',
            description: 'A public project',
            isPublic: true,
            featured: false,
            userId: testUser.id,
          },
          {
            title: 'Private Project',
            description: 'A private project',
            isPublic: false,
            featured: false,
            userId: testUser.id,
          },
          {
            title: 'Featured Project',
            description: 'A featured project',
            isPublic: true,
            featured: true,
            userId: testUser.id,
          },
        ],
      });
    });

    it('should find public projects only', async () => {
      const publicProjects = await prisma.project.findMany({
        where: { isPublic: true },
      });

      expect(publicProjects).toHaveLength(2);
      expect(publicProjects.every((p) => p.isPublic)).toBe(true);
    });

    it('should find featured projects only', async () => {
      const featuredProjects = await prisma.project.findMany({
        where: { featured: true },
      });

      expect(featuredProjects).toHaveLength(1);
      expect(featuredProjects[0].title).toBe('Featured Project');
    });

    it('should find projects by user', async () => {
      const userProjects = await prisma.project.findMany({
        where: { userId: testUser.id },
      });

      expect(userProjects).toHaveLength(3);
    });

    it('should search projects by title', async () => {
      const searchResults = await prisma.project.findMany({
        where: {
          title: {
            contains: 'Public',
            mode: 'insensitive',
          },
        },
      });

      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].title).toBe('Public Project');
    });
  });

  describe('Project Updates', () => {
    let testProject: any;

    beforeEach(async () => {
      testProject = await prisma.project.create({
        data: {
          title: 'Test Project',
          description: 'A test project description',
          userId: testUser.id,
        },
      });
    });

    it('should update project details', async () => {
      const updatedProject = await prisma.project.update({
        where: { id: testProject.id },
        data: {
          title: 'Updated Project',
          description: 'Updated description',
          githubUrl: 'https://github.com/user/updated-project',
          isPublic: false,
          featured: true,
        },
      });

      expect(updatedProject.title).toBe('Updated Project');
      expect(updatedProject.description).toBe('Updated description');
      expect(updatedProject.githubUrl).toBe(
        'https://github.com/user/updated-project'
      );
      expect(updatedProject.isPublic).toBe(false);
      expect(updatedProject.featured).toBe(true);
      expect(updatedProject.updatedAt.getTime()).toBeGreaterThan(
        testProject.updatedAt.getTime()
      );
    });
  });

  describe('Project Deletion', () => {
    it('should delete project', async () => {
      const project = await prisma.project.create({
        data: {
          title: 'Test Project',
          description: 'A test project description',
          userId: testUser.id,
        },
      });

      await prisma.project.delete({
        where: { id: project.id },
      });

      const deletedProject = await prisma.project.findUnique({
        where: { id: project.id },
      });

      expect(deletedProject).toBeNull();
    });
  });
});