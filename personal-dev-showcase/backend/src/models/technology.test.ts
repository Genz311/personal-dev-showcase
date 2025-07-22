import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

describe('Technology Model', () => {
  let testUser: any;
  let testProject: any;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.projectTechnology.deleteMany();
    await prisma.project.deleteMany();
    await prisma.technology.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
    await prisma.projectTechnology.deleteMany();
    await prisma.project.deleteMany();
    await prisma.technology.deleteMany();
    await prisma.user.deleteMany();

    // Create test user and project
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
        displayName: 'Test User',
      },
    });

    testProject = await prisma.project.create({
      data: {
        title: 'Test Project',
        description: 'A test project description',
        userId: testUser.id,
      },
    });
  });

  describe('Technology Creation', () => {
    it('should create a new technology', async () => {
      const technologyData = {
        name: 'React',
        category: 'frontend',
        color: '#61DAFB',
      };

      const technology = await prisma.technology.create({
        data: technologyData,
      });

      expect(technology).toBeDefined();
      expect(technology.id).toBeDefined();
      expect(technology.name).toBe(technologyData.name);
      expect(technology.category).toBe(technologyData.category);
      expect(technology.color).toBe(technologyData.color);
    });

    it('should create technology without color', async () => {
      const technologyData = {
        name: 'Node.js',
        category: 'backend',
      };

      const technology = await prisma.technology.create({
        data: technologyData,
      });

      expect(technology.name).toBe(technologyData.name);
      expect(technology.category).toBe(technologyData.category);
      expect(technology.color).toBeNull();
    });

    it('should enforce unique name constraint', async () => {
      const technologyData = {
        name: 'React',
        category: 'frontend',
      };

      // Create first technology
      await prisma.technology.create({ data: technologyData });

      // Attempt to create second technology with same name
      await expect(
        prisma.technology.create({ data: technologyData })
      ).rejects.toThrow();
    });
  });

  describe('Technology Categories', () => {
    it('should create technologies with different categories', async () => {
      const technologies = [
        { name: 'React', category: 'frontend' },
        { name: 'Node.js', category: 'backend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Docker', category: 'tool' },
        { name: 'Figma', category: 'other' },
      ];

      for (const tech of technologies) {
        await prisma.technology.create({ data: tech });
      }

      const frontendTechs = await prisma.technology.findMany({
        where: { category: 'frontend' },
      });

      const backendTechs = await prisma.technology.findMany({
        where: { category: 'backend' },
      });

      expect(frontendTechs).toHaveLength(1);
      expect(backendTechs).toHaveLength(1);
      expect(frontendTechs[0].name).toBe('React');
      expect(backendTechs[0].name).toBe('Node.js');
    });
  });

  describe('Project-Technology Relationships', () => {
    let reactTech: any;
    let nodeTech: any;

    beforeEach(async () => {
      reactTech = await prisma.technology.create({
        data: { name: 'React', category: 'frontend' },
      });

      nodeTech = await prisma.technology.create({
        data: { name: 'Node.js', category: 'backend' },
      });
    });

    it('should associate technologies with project', async () => {
      // Create associations
      await prisma.projectTechnology.createMany({
        data: [
          { projectId: testProject.id, technologyId: reactTech.id },
          { projectId: testProject.id, technologyId: nodeTech.id },
        ],
      });

      // Query project with technologies
      const projectWithTechs = await prisma.project.findUnique({
        where: { id: testProject.id },
        include: {
          technologies: {
            include: { technology: true },
          },
        },
      });

      expect(projectWithTechs?.technologies).toHaveLength(2);
      
      const techNames = projectWithTechs?.technologies.map(
        (pt) => pt.technology.name
      );
      expect(techNames).toContain('React');
      expect(techNames).toContain('Node.js');
    });

    it('should find projects by technology', async () => {
      // Create another project and user
      const anotherUser = await prisma.user.create({
        data: {
          email: 'user2@example.com',
          username: 'user2',
          password: await bcrypt.hash('password123', 10),
          displayName: 'User Two',
        },
      });

      const anotherProject = await prisma.project.create({
        data: {
          title: 'Another Project',
          description: 'Another description',
          userId: anotherUser.id,
        },
      });

      // Associate React with both projects
      await prisma.projectTechnology.createMany({
        data: [
          { projectId: testProject.id, technologyId: reactTech.id },
          { projectId: anotherProject.id, technologyId: reactTech.id },
          { projectId: testProject.id, technologyId: nodeTech.id },
        ],
      });

      // Find all projects using React
      const reactProjects = await prisma.project.findMany({
        where: {
          technologies: {
            some: {
              technologyId: reactTech.id,
            },
          },
        },
        include: {
          technologies: {
            include: { technology: true },
          },
        },
      });

      expect(reactProjects).toHaveLength(2);
    });

    it('should enforce unique project-technology association', async () => {
      // Create first association
      await prisma.projectTechnology.create({
        data: { projectId: testProject.id, technologyId: reactTech.id },
      });

      // Attempt to create duplicate association
      await expect(
        prisma.projectTechnology.create({
          data: { projectId: testProject.id, technologyId: reactTech.id },
        })
      ).rejects.toThrow();
    });

    it('should cascade delete project-technology associations when project is deleted', async () => {
      // Create associations
      await prisma.projectTechnology.createMany({
        data: [
          { projectId: testProject.id, technologyId: reactTech.id },
          { projectId: testProject.id, technologyId: nodeTech.id },
        ],
      });

      // Verify associations exist
      const associationsBefore = await prisma.projectTechnology.findMany({
        where: { projectId: testProject.id },
      });
      expect(associationsBefore).toHaveLength(2);

      // Delete project
      await prisma.project.delete({
        where: { id: testProject.id },
      });

      // Verify associations are also deleted
      const associationsAfter = await prisma.projectTechnology.findMany({
        where: { projectId: testProject.id },
      });
      expect(associationsAfter).toHaveLength(0);
    });

    it('should cascade delete project-technology associations when technology is deleted', async () => {
      // Create association
      await prisma.projectTechnology.create({
        data: { projectId: testProject.id, technologyId: reactTech.id },
      });

      // Verify association exists
      const associationBefore = await prisma.projectTechnology.findFirst({
        where: { 
          projectId: testProject.id, 
          technologyId: reactTech.id 
        },
      });
      expect(associationBefore).toBeDefined();

      // Delete technology
      await prisma.technology.delete({
        where: { id: reactTech.id },
      });

      // Verify association is also deleted
      const associationAfter = await prisma.projectTechnology.findFirst({
        where: { 
          projectId: testProject.id, 
          technologyId: reactTech.id 
        },
      });
      expect(associationAfter).toBeNull();
    });
  });

  describe('Technology Queries', () => {
    beforeEach(async () => {
      // Create test technologies
      await prisma.technology.createMany({
        data: [
          { name: 'React', category: 'frontend', color: '#61DAFB' },
          { name: 'Vue.js', category: 'frontend', color: '#4FC08D' },
          { name: 'Node.js', category: 'backend', color: '#339933' },
          { name: 'Express', category: 'backend' },
          { name: 'PostgreSQL', category: 'database', color: '#336791' },
        ],
      });
    });

    it('should find technologies by category', async () => {
      const frontendTechs = await prisma.technology.findMany({
        where: { category: 'frontend' },
        orderBy: { name: 'asc' },
      });

      expect(frontendTechs).toHaveLength(2);
      expect(frontendTechs[0].name).toBe('React');
      expect(frontendTechs[1].name).toBe('Vue.js');
    });

    it('should search technologies by name', async () => {
      const searchResults = await prisma.technology.findMany({
        where: {
          name: {
            contains: 'react',
            mode: 'insensitive',
          },
        },
      });

      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].name).toBe('React');
    });

    it('should find technologies with color', async () => {
      const coloredTechs = await prisma.technology.findMany({
        where: {
          color: {
            not: null,
          },
        },
      });

      expect(coloredTechs).toHaveLength(4);
    });
  });
});