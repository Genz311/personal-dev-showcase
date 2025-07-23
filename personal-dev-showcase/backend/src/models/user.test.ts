import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

// This test suite will run when database is available
describe('User Model', () => {
  beforeAll(async () => {
    // Setup test database connection
    await prisma.$connect();
  });

  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
    await prisma.user.deleteMany();
  });

  describe('User Creation', () => {
    it('should create a new user with required fields', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
        name: 'Test User',
      };

      const user = await prisma.user.create({
        data: userData,
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);
      expect(user.name).toBe(userData.name);
      expect(user.isPublic).toBe(true); // default value
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should create a user with optional fields', async () => {
      const userData = {
        email: 'test2@example.com',
        username: 'testuser2',
        password: await bcrypt.hash('password123', 10),
        name: 'Test User 2',
        bio: 'Software developer',
        github: 'https://github.com/testuser2',
        isPublic: false,
      };

      const user = await prisma.user.create({
        data: userData,
      });

      expect(user.bio).toBe(userData.bio);
      expect(user.github).toBe(userData.github);
      expect(user.isPublic).toBe(false);
    });

    it('should enforce unique email constraint', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser1',
        password: await bcrypt.hash('password123', 10),
        name: 'Test User 1',
      };

      // Create first user
      await prisma.user.create({ data: userData });

      // Attempt to create second user with same email
      const duplicateUserData = {
        ...userData,
        username: 'testuser2',
      };

      await expect(
        prisma.user.create({ data: duplicateUserData })
      ).rejects.toThrow();
    });

    it('should enforce unique username constraint', async () => {
      const userData = {
        email: 'test1@example.com',
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
        name: 'Test User 1',
      };

      // Create first user
      await prisma.user.create({ data: userData });

      // Attempt to create second user with same username
      const duplicateUserData = {
        ...userData,
        email: 'test2@example.com',
      };

      await expect(
        prisma.user.create({ data: duplicateUserData })
      ).rejects.toThrow();
    });
  });

  describe('User Queries', () => {
    beforeEach(async () => {
      // Create test users
      await prisma.user.createMany({
        data: [
          {
            email: 'user1@example.com',
            username: 'user1',
            password: await bcrypt.hash('password123', 10),
            name: 'User One',
            isPublic: true,
          },
          {
            email: 'user2@example.com',
            username: 'user2',
            password: await bcrypt.hash('password123', 10),
            name: 'User Two',
            isPublic: false,
          },
        ],
      });
    });

    it('should find user by email', async () => {
      const user = await prisma.user.findUnique({
        where: { email: 'user1@example.com' },
      });

      expect(user).toBeDefined();
      expect(user?.email).toBe('user1@example.com');
    });

    it('should find user by username', async () => {
      const user = await prisma.user.findUnique({
        where: { username: 'user1' },
      });

      expect(user).toBeDefined();
      expect(user?.username).toBe('user1');
    });

    it('should find public users only', async () => {
      const publicUsers = await prisma.user.findMany({
        where: { isPublic: true },
      });

      expect(publicUsers).toHaveLength(1);
      expect(publicUsers[0].username).toBe('user1');
    });
  });

  describe('User Updates', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          username: 'testuser',
          password: await bcrypt.hash('password123', 10),
          name: 'Test User',
        },
      });
    });

    it('should update user profile', async () => {
      const updatedUser = await prisma.user.update({
        where: { id: testUser.id },
        data: {
          name: 'Updated Name',
          bio: 'Updated bio',
          github: 'https://github.com/updated',
        },
      });

      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.bio).toBe('Updated bio');
      expect(updatedUser.github).toBe('https://github.com/updated');
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(
        testUser.updatedAt.getTime()
      );
    });
  });

  describe('User Deletion', () => {
    it('should delete user', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          username: 'testuser',
          password: await bcrypt.hash('password123', 10),
          name: 'Test User',
        },
      });

      await prisma.user.delete({
        where: { id: user.id },
      });

      const deletedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(deletedUser).toBeNull();
    });
  });
});