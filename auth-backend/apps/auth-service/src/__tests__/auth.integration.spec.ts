import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AuthModule } from '../auth/auth.module';

describe('AUTH Service Integration Tests', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('FR-001: User Registration', () => {
    it('should register a new user with email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test-integration@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test User');
      expect(response.body.email).toBe('test-integration@example.com');
      expect(response.body.emailVerified).toBe(false);
      userId = response.body.id;
    });

    it('should register a new user with phone', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Phone User',
          phone: '+1234567890',
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Phone User');
      expect(response.body.phone).toBe('+1234567890');
    });

    it('should reject registration with duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Duplicate',
          email: 'test-integration@example.com',
          password: 'password123',
        })
        .expect(409);
    });

    it('should reject registration with missing name', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'new@test.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.message).toContain('name must be a string');
    });

    it('should reject registration with short password', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Test',
          email: 'new@test.com',
          password: '123',
        })
        .expect(400);

      expect(response.body.message).toContain('password must be longer than or equal to 8 characters');
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Test',
          email: 'not-an-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.message).toContain('email must be an email');
    });

    it('should reject registration with extra fields', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Test',
          email: 'extra@test.com',
          password: 'password123',
          hacker: 'field',
        })
        .expect(400);
    });
  });

  describe('FR-002: User Login', () => {
    it('should login with email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          identifier: 'test-integration@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.expiresIn).toBe(900);
      expect(response.body.tokenType).toBe('Bearer');
      expect(response.body.user.email).toBe('test-integration@example.com');
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('should login with phone', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          identifier: '+1234567890',
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.phone).toBe('+1234567890');
    });

    it('should reject login with wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          identifier: 'test-integration@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should reject login with non-existent user', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          identifier: 'nonexistent@test.com',
          password: 'password123',
        })
        .expect(401);
    });

    it('should reject login with missing identifier', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          password: 'password123',
        })
        .expect(400);

      expect(response.body.message).toContain('identifier must be a string');
    });
  });

  describe('FR-003: Logout', () => {
    it('should logout successfully', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);
    });

    it('should reject logout without token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .expect(401);
    });
  });

  describe('FR-004: Refresh Token', () => {
    it('should refresh access token', async () => {
      // Login again to get new tokens
      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          identifier: 'test-integration@example.com',
          password: 'password123',
        })
        .expect(201);

      const newRefreshToken = loginResponse.body.refreshToken;

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: newRefreshToken })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.expiresIn).toBe(900);
    });

    it('should reject refresh with invalid token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });
  });

  describe('FR-005: Forgot Password (Email)', () => {
    it('should send password reset email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'test-integration@example.com' })
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should not reveal if email exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'nonexistent@test.com' })
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });

  describe('FR-006: Forgot Password (Phone)', () => {
    it('should send password reset OTP', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/forgot-password-phone')
        .send({ phone: '+1234567890' })
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });

  describe('FR-007: Change Password', () => {
    it('should change password', async () => {
      // Login to get token
      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          identifier: 'test-integration@example.com',
          password: 'password123',
        })
        .expect(201);

      const token = loginResponse.body.accessToken;

      await request(app.getHttpServer())
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123',
        })
        .expect(201);
    });

    it('should reject change password without auth', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/change-password')
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123',
        })
        .expect(401);
    });
  });

  describe('FR-008: Verify Email', () => {
    it('should verify email with token', async () => {
      // This will fail because we don't have a real token
      // but it tests the endpoint exists and validates input
      await request(app.getHttpServer())
        .get('/api/v1/auth/verify-email?token=invalid-token')
        .expect(400);
    });
  });

  describe('FR-009: Verify Phone', () => {
    it('should verify phone with OTP', async () => {
      // This will fail because we don't have a real OTP
      // but it tests the endpoint exists and validates input
      await request(app.getHttpServer())
        .post('/api/v1/auth/verify-phone')
        .send({ phone: '+1234567890', code: '000000' })
        .expect(400);
    });

    it('should reject verify phone with short code', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/verify-phone')
        .send({ phone: '+1234567890', code: '123' })
        .expect(400);

      expect(response.body.message).toContain('code must be longer than or equal to 6 characters');
    });
  });

  describe('FR-010: Manage Users', () => {
    it('should reject list users without admin token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });

  describe('FR-011: Manage Roles', () => {
    it('should reject create role without admin token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'test-role' })
        .expect(403);
    });
  });

  describe('Webhooks', () => {
    it('should handle SMS webhook', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/webhooks/sms/delivered')
        .send({
          MessageSid: 'SM123456',
          MessageStatus: 'delivered',
          To: '+1234567890',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should reject SMS webhook with missing fields', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/webhooks/sms/delivered')
        .send({
          MessageSid: 'SM123456',
        })
        .expect(400);
    });
  });

  describe('Validation', () => {
    it('should reject unknown routes', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/nonexistent')
        .expect(404);
    });
  });
});
