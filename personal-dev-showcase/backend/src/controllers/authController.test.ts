import request from 'supertest';
import express from 'express';
import { prisma } from '../lib/prisma';
import authRoutes from '../routes/authRoutes';
import { hashPassword } from '../utils/password';
import { generateTokenPair, verifyAccessToken, verifyRefreshToken } from '../utils/jwt';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Controller', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up database
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    const validUserData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      
      expect(response.body.user.email).toBe(validUserData.email.toLowerCase());
      expect(response.body.user.username).toBe(validUserData.username.toLowerCase());
      expect(response.body.user).not.toHaveProperty('password');
      
      // Verify tokens
      const decodedAccess = verifyAccessToken(response.body.accessToken);
      expect(decodedAccess.userId).toBe(response.body.user.id);
      
      const decodedRefresh = verifyRefreshToken(response.body.refreshToken);
      expect(decodedRefresh.userId).toBe(response.body.user.id);
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUserData,
          email: 'invalid-email',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].field).toBe('email');
    });

    it('should reject registration with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUserData,
          password: '12345',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].field).toBe('password');
    });

    it('should reject duplicate email', async () => {
      // Create first user
      await prisma.user.create({
        data: {
          email: validUserData.email.toLowerCase(),
          username: 'anotheruser',
          password: await hashPassword('password123'),
          name: 'Another User',
        },
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(409);
      expect(response.body.errors[0].field).toBe('email');
    });

    it('should reject duplicate username', async () => {
      // Create first user
      await prisma.user.create({
        data: {
          email: 'another@example.com',
          username: validUserData.username.toLowerCase(),
          password: await hashPassword('password123'),
          name: 'Another User',
        },
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(409);
      expect(response.body.errors[0].field).toBe('username');
    });

    it('should handle case-insensitive email and username', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUserData,
          email: 'TEST@EXAMPLE.COM',
          username: 'TESTUSER',
        });

      expect(response.status).toBe(409);
    });

    it('should use username as name if not provided', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.user.name).toBe('testuser');
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser: any;
    const password = 'password123';

    beforeEach(async () => {
      testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          username: 'testuser',
          password: await hashPassword(password),
          name: 'Test User',
        },
      });
    });

    it('should login with email successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.id).toBe(testUser.id);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should login with username successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'testuser',
          password,
        });

      expect(response.status).toBe(200);
      expect(response.body.user.id).toBe(testUser.id);
    });

    it('should handle case-insensitive login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'TESTUSER',
          password,
        });

      expect(response.status).toBe(200);
      expect(response.body.user.id).toBe(testUser.id);
    });

    it('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.errors[0].field).toBe('password');
    });

    it('should reject login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'nonexistent@example.com',
          password,
        });

      expect(response.status).toBe(401);
      expect(response.body.errors[0].field).toBe('emailOrUsername');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: '',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(2);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let testUser: any;
    let validRefreshToken: string;

    beforeEach(async () => {
      testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          username: 'testuser',
          password: await hashPassword('password123'),
          name: 'Test User',
        },
      });

      const tokens = generateTokenPair({
        userId: testUser.id,
        email: testUser.email,
        username: testUser.username,
      });
      validRefreshToken = tokens.refreshToken;
    });

    it('should refresh tokens successfully', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: validRefreshToken,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      
      // Verify new tokens
      const decodedAccess = verifyAccessToken(response.body.accessToken);
      expect(decodedAccess.userId).toBe(testUser.id);
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid-token',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid or expired refresh token');
    });

    it('should reject missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Refresh token required');
    });

    it('should reject refresh token for deleted user', async () => {
      await prisma.user.delete({ where: { id: testUser.id } });

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: validRefreshToken,
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('POST /api/auth/logout', () => {
    let testUser: any;
    let accessToken: string;

    beforeEach(async () => {
      testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          username: 'testuser',
          password: await hashPassword('password123'),
          name: 'Test User',
        },
      });

      const tokens = generateTokenPair({
        userId: testUser.id,
        email: testUser.email,
        username: testUser.username,
      });
      accessToken = tokens.accessToken;
    });

    it('should logout successfully with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');
    });

    it('should reject logout without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
    });

    it('should reject logout with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid or expired token');
    });
  });
});