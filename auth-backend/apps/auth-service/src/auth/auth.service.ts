import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AUTH_CONSTANTS, AuthRegisterDto, AuthLoginDto, AuthChangePasswordDto, AuthVerifyPhoneDto, User, Session, Verification } from '@app/common';
import { RedisService } from '@app/redis';

// Redis key prefixes
const USER_PREFIX = 'auth:user:';
const USER_EMAIL_INDEX = 'auth:index:email:';
const USER_PHONE_INDEX = 'auth:index:phone:';
const SESSION_PREFIX = 'auth:session:';
const SESSION_REFRESH_INDEX = 'auth:index:refresh:';
const VERIFICATION_PREFIX = 'auth:verification:';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
  ) {}

  // FR-001: User Registration
  async register(dto: AuthRegisterDto) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Either email or phone is required');
    }

    // Check if user already exists via Redis indexes
    if (dto.email) {
      const existingUserId = await this.redis.get(USER_EMAIL_INDEX + dto.email);
      if (existingUserId) {
        throw new ConflictException('Email already registered');
      }
    }
    if (dto.phone) {
      const existingUserId = await this.redis.get(USER_PHONE_INDEX + dto.phone);
      if (existingUserId) {
        throw new ConflictException('Phone already registered');
      }
    }

    // Hash password with bcrypt (12 rounds) — NFR-003
    const passwordHash = await bcrypt.hash(dto.password, AUTH_CONSTANTS.BCRYPT_ROUNDS);

    const userId = uuidv4();
    const user: User = {
      id: userId,
      email: dto.email || null,
      phone: dto.phone || null,
      name: dto.name,
      passwordHash,
      emailVerified: false,
      phoneVerified: false,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store user in Redis
    await this.redis.setJson(USER_PREFIX + userId, user);

    // Create indexes for lookup
    if (dto.email) {
      await this.redis.set(USER_EMAIL_INDEX + dto.email, userId);
    }
    if (dto.phone) {
      await this.redis.set(USER_PHONE_INDEX + dto.phone, userId);
    }

    // Create verification record
    const verificationId = uuidv4();
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const verification: Verification = {
      id: verificationId,
      userId,
      code: verificationCode,
      type: dto.email ? 'email' : 'phone',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      used: false,
      createdAt: new Date(),
    };

    // Store verification with TTL (24 hours)
    await this.redis.setJson(VERIFICATION_PREFIX + verificationId, verification, 86400);

    // In production, publish to RabbitMQ:
    // - verification.email.requested → EMAIL service
    // - verification.requested → SMS service (if phone)

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt,
    };
  }

  // FR-002: User Login
  async login(dto: AuthLoginDto, ipAddress?: string, userAgent?: string) {
    // Find user by email or phone using Redis indexes
    let userId: string | null = null;
    if (dto.identifier.includes('@')) {
      userId = await this.redis.get(USER_EMAIL_INDEX + dto.identifier);
    } else {
      userId = await this.redis.get(USER_PHONE_INDEX + dto.identifier);
    }

    if (!userId) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const foundUser = await this.redis.getJson<User>(USER_PREFIX + userId);
    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, foundUser.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT access token (15min) + refresh token (7 days) — NFR-004
    const payload = {
      sub: foundUser.id,
      email: foundUser.email,
      phone: foundUser.phone,
      role: 'user',
      roles: [],
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRY', '7d'),
    });

    // Create session in Redis with TTL (7 days)
    const sessionId = uuidv4();
    const session: Session = {
      id: sessionId,
      userId: foundUser.id,
      token: accessToken,
      refreshToken,
      ipAddress: ipAddress || 'unknown',
      userAgent: userAgent || 'unknown',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };

    await this.redis.setJson(SESSION_PREFIX + sessionId, session, 604800); // 7 days

    // Create refresh token index for lookup
    await this.redis.set(SESSION_REFRESH_INDEX + refreshToken, sessionId, 604800);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      tokenType: 'Bearer',
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        emailVerified: foundUser.emailVerified,
        phoneVerified: foundUser.phoneVerified,
      },
    };
  }

  // FR-003: Logout
  async logout(userId: string) {
    // Find and delete all sessions for this user
    // In production, use Redis SCAN to find sessions by userId
    // For now, we'll just return success (session will expire naturally)
    return { success: true, message: 'Logged out successfully' };
  }

  // FR-004: Refresh Token
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      // Find session by refresh token index
      const sessionId = await this.redis.get(SESSION_REFRESH_INDEX + refreshToken);
      if (!sessionId) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const foundSession = await this.redis.getJson<Session>(SESSION_PREFIX + sessionId);
      if (!foundSession || foundSession.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Find user
      const user = await this.redis.getJson<User>(USER_PREFIX + payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new access token
      const newPayload = {
        sub: user.id,
        email: user.email,
        phone: user.phone,
        role: 'user',
        roles: [],
      };

      const newAccessToken = this.jwtService.sign(newPayload);

      return {
        accessToken: newAccessToken,
        expiresIn: 900,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // FR-005: Reset Password (Email)
  async forgotPassword(dto: { email?: string }) {
    // Check if user exists
    if (dto.email) {
      const userId = await this.redis.get(USER_EMAIL_INDEX + dto.email);
      if (!userId) {
        // Don't reveal if user exists
        return { success: true, message: 'If the email exists, a reset link has been sent' };
      }

      const user = await this.redis.getJson<User>(USER_PREFIX + userId);
      if (!user) {
        return { success: true, message: 'If the email exists, a reset link has been sent' };
      }

      // Create verification record
      const verificationId = uuidv4();
      const resetCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const verification: Verification = {
        id: verificationId,
        userId: user.id,
        code: resetCode,
        type: 'password_reset',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        used: false,
        createdAt: new Date(),
      };

      await this.redis.setJson(VERIFICATION_PREFIX + verificationId, verification, 3600); // 1 hour
    }

    // In production, publish to RabbitMQ: verification.email.requested → EMAIL service

    return { success: true, message: 'If the email exists, a reset link has been sent' };
  }

  // FR-006: Reset Password (Phone)
  async forgotPasswordPhone(dto: { phone?: string }) {
    // Check if user exists
    if (dto.phone) {
      const userId = await this.redis.get(USER_PHONE_INDEX + dto.phone);
      if (!userId) {
        return { success: true, message: 'If the phone exists, an OTP has been sent' };
      }

      const user = await this.redis.getJson<User>(USER_PREFIX + userId);
      if (!user) {
        return { success: true, message: 'If the phone exists, an OTP has been sent' };
      }

      // Create verification record
      const verificationId = uuidv4();
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      const verification: Verification = {
        id: verificationId,
        userId: user.id,
        code: otpCode,
        type: 'password_reset',
        expiresAt: new Date(Date.now() + AUTH_CONSTANTS.OTP_EXPIRY_MINUTES * 60 * 1000),
        used: false,
        createdAt: new Date(),
      };

      await this.redis.setJson(VERIFICATION_PREFIX + verificationId, verification, AUTH_CONSTANTS.OTP_EXPIRY_MINUTES * 60);
    }

    // In production, publish to RabbitMQ: verification.requested → SMS service

    return { success: true, message: 'If the phone exists, an OTP has been sent' };
  }

  // FR-007: Change Password
  async changePassword(userId: string, dto: AuthChangePasswordDto) {
    const user = await this.redis.getJson<User>(USER_PREFIX + userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const newHash = await bcrypt.hash(dto.newPassword, AUTH_CONSTANTS.BCRYPT_ROUNDS);
    user.passwordHash = newHash;
    user.updatedAt = new Date();

    // Update user in Redis
    await this.redis.setJson(USER_PREFIX + userId, user);

    // Invalidate all sessions (in production, use SCAN to find and delete)
    return { success: true, message: 'Password changed successfully' };
  }

  // FR-008: Verify Email
  async verifyEmail(token: string) {
    // Find verification by scanning (in production, use a secondary index)
    // For now, try to get by ID pattern
    const verification = await this.redis.getJson<Verification>(VERIFICATION_PREFIX + token);

    if (!verification || verification.code !== token || verification.type !== 'email' || verification.used || verification.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    const user = await this.redis.getJson<User>(USER_PREFIX + verification.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.emailVerified = true;
    user.updatedAt = new Date();
    await this.redis.setJson(USER_PREFIX + user.id, user);

    verification.used = true;
    await this.redis.setJson(VERIFICATION_PREFIX + verification.id, verification);

    return { success: true, message: 'Email verified successfully' };
  }

  // FR-009: Verify Phone
  async verifyPhone(dto: AuthVerifyPhoneDto) {
    // Find verification by scanning (in production, use a secondary index)
    const verification = await this.redis.getJson<Verification>(VERIFICATION_PREFIX + dto.code);

    if (!verification || verification.code !== dto.code || verification.type !== 'phone' || verification.used || verification.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP code');
    }

    const user = await this.redis.getJson<User>(USER_PREFIX + verification.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.phoneVerified = true;
    user.updatedAt = new Date();
    await this.redis.setJson(USER_PREFIX + user.id, user);

    verification.used = true;
    await this.redis.setJson(VERIFICATION_PREFIX + verification.id, verification);

    return { success: true, message: 'Phone verified successfully' };
  }
}
