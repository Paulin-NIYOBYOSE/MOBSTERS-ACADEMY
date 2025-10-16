import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  UserNotFoundException,
  InvalidPasswordException,
  EmailAlreadyExistsException,
  InvalidRefreshTokenException,
  AuthServerException,
  AccountDisabledException,
  AccountLockedException,
  WeakPasswordException,
} from './exceptions/auth.exceptions';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly maxLoginAttempts = 5;
  private readonly lockoutDuration = 15 * 60 * 1000; // 15 minutes

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private usersService: UsersService,
  ) {}

async register(dto: RegisterDto) {
  try {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ 
      where: { email: dto.email } 
    });
    
    if (existingUser) {
      throw new EmailAlreadyExistsException(dto.email);
    }

    // Validate password strength (additional server-side check)
    this.validatePasswordStrength(dto.password);

    const hashedPassword = await bcrypt.hash(dto.password, 12); // Increased rounds for better security
    
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });

    // Assign default 'community_student' role
    const communityRole = await this.prisma.role.findUnique({ 
      where: { name: 'community_student' } 
    });
    
    if (communityRole) {
      await this.prisma.userRole.create({
        data: { userId: user.id, roleId: communityRole.id },
      });
    }

    this.logger.log(`New user registered: ${dto.email}`);
    return { message: 'User registered successfully', userId: user.id };
  } catch (error) {
    if (error instanceof EmailAlreadyExistsException || error instanceof WeakPasswordException) {
      throw error;
    }
    this.logger.error(`Registration failed for ${dto.email}:`, error);
    throw new AuthServerException(error);
  }
}

  async login(dto: LoginDto) {
    try {
      // Find user
      const user = await this.prisma.user.findUnique({ 
        where: { email: dto.email }
      });

      if (!user) {
        // Log failed attempt for non-existent user
        await this.recordLoginAttempt(dto.email, false, 'User not found');
        throw new UserNotFoundException(dto.email);
      }

      // Note: Account status and lockout checks would require additional Prisma schema fields
      // For now, we'll implement basic rate limiting through the RateLimitGuard

      // Verify password
      const passwordMatch = await bcrypt.compare(dto.password, user.password);
      if (!passwordMatch) {
        await this.recordLoginAttempt(dto.email, false, 'Invalid password', user.id);
        throw new InvalidPasswordException();
      }

      // Successful login - record attempt and generate tokens
      await this.recordLoginAttempt(dto.email, true, 'Login successful', user.id);
      
      const roles = await this.usersService.getUserRoles(user.id);
      const payload = { sub: user.id, roles, email: user.email };
      const accessToken = this.jwt.sign(payload);
      const refreshToken = this.generateRefreshToken();
      await this.storeRefreshToken(refreshToken, user.id);

      this.logger.log(`Successful login for user: ${dto.email}`);
      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof UserNotFoundException || 
          error instanceof InvalidPasswordException ||
          error instanceof AccountDisabledException ||
          error instanceof AccountLockedException) {
        throw error;
      }
      this.logger.error(`Login failed for ${dto.email}:`, error);
      throw new AuthServerException(error);
    }
  }

  private generateRefreshToken(): string {
    return require('crypto').randomBytes(64).toString('hex');
  }

  private async storeRefreshToken(token: string, userId: number) {
    const hashedToken = await bcrypt.hash(token, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        hashedToken,
        userId,
        expiresAt,
      },
    });
  }

  async refresh(refreshToken: string) {
    try {
      const tokenRecord = await this.findRefreshToken(refreshToken);
      
      if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
        throw new InvalidRefreshTokenException();
      }

      const user = await this.prisma.user.findUnique({ 
        where: { id: tokenRecord.userId } 
      });
      
      if (!user) {
        throw new UserNotFoundException();
      }

      // Note: Account status check would require additional Prisma schema field
      // if (user.status === 'disabled') {
      //   throw new AccountDisabledException();
      // }

      const roles = await this.usersService.getUserRoles(user.id);
      const payload = { sub: user.id, roles, email: user.email };
      const newAccessToken = this.jwt.sign(payload);
      const newRefreshToken = this.generateRefreshToken();

      // Clean up old token and store new one
      await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      await this.storeRefreshToken(newRefreshToken, user.id);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error instanceof InvalidRefreshTokenException ||
          error instanceof UserNotFoundException ||
          error instanceof AccountDisabledException) {
        throw error;
      }
      this.logger.error('Token refresh failed:', error);
      throw new AuthServerException(error);
    }
  }

  private async findRefreshToken(token: string) {
    // Note: This method needs to be fixed - we should store and compare hashed tokens properly
    // For now, we'll find by comparing all tokens (not ideal for production)
    const allTokens = await this.prisma.refreshToken.findMany({
      where: { revoked: false }
    });
    
    for (const tokenRecord of allTokens) {
      const isMatch = await bcrypt.compare(token, tokenRecord.hashedToken);
      if (isMatch) {
        return tokenRecord;
      }
    }
    
    return null;
  }

  private validatePasswordStrength(password: string): void {
    const requirements: string[] = [];
    
    if (password.length < 8) {
      requirements.push('At least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      requirements.push('At least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      requirements.push('At least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      requirements.push('At least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      requirements.push('At least one special character (@$!%*?&)');
    }
    
    if (requirements.length > 0) {
      throw new WeakPasswordException(requirements);
    }
  }

  private async recordLoginAttempt(
    email: string, 
    successful: boolean, 
    reason: string, 
    userId?: number
  ): Promise<void> {
    try {
      // This assumes you have a LoginAttempt model in your Prisma schema
      // If not, you can remove this or create the model
      // Note: Login attempt logging would require a LoginAttempt model in Prisma schema
      // For now, we'll use the logger for audit trails
      this.logger.log(`Login attempt for ${email}: ${successful ? 'SUCCESS' : 'FAILED'} - ${reason}`);
    } catch (error) {
      // Don't fail the login process if logging fails
      this.logger.warn('Failed to record login attempt:', error);
    }
  }

  async logout(userId: number) {
    try {
      await this.prisma.refreshToken.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true },
      });
      
      this.logger.log(`User ${userId} logged out successfully`);
      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error(`Logout failed for user ${userId}:`, error);
      throw new AuthServerException(error);
    }
  }
}