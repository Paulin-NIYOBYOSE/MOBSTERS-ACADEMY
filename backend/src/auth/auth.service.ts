import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private usersService: UsersService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });

    // Create pending role request if program selected
    if (dto.program) {
      await this.prisma.pendingRoleRequest.create({
        data: {
          userId: user.id,
          program: dto.program,
        },
      });
    }

    return { message: 'User registered successfully', userId: user.id };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = await this.usersService.getUserRoles(user.id);
    const payload = { sub: user.id, roles };
    const accessToken = this.jwt.sign(payload);
    const refreshToken = this.generateRefreshToken();
    await this.storeRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken };
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
    const tokenRecord = await this.findRefreshToken(refreshToken);
    if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: tokenRecord.userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const roles = await this.usersService.getUserRoles(user.id);
    const payload = { sub: user.id, roles };
    const newAccessToken = this.jwt.sign(payload);
    const newRefreshToken = this.generateRefreshToken();

    await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
    await this.storeRefreshToken(newRefreshToken, user.id);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  private async findRefreshToken(token: string) {
    const hashedToken = await bcrypt.hash(token, 10);
    return this.prisma.refreshToken.findFirst({
      where: { hashedToken },
    });
  }

  async logout(userId: number) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
    return { message: 'Logged out successfully' };
  }
}