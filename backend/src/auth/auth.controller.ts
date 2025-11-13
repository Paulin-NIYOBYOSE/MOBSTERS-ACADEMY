import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, UseFilters, ValidationPipe, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtGuard } from './guards/jwt.guard';
import { Request } from 'express';
import { AuthExceptionFilter } from '../common/filters/auth-exception.filter';
import { RateLimitGuard, RateLimit } from '../common/guards/rate-limit.guard';

@Controller('auth')
@UseFilters(AuthExceptionFilter)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true, 
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
}))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseGuards(RateLimitGuard)
  @RateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3, // 3 registration attempts per hour
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(RateLimitGuard)
  @RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5, // 5 login attempts per 15 minutes
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@Req() req: Request) {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @UseGuards(RateLimitGuard)
  @RateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxAttempts: 10, // 10 refresh attempts per 5 minutes
  })
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: Request) {
    const userId = (req.user as any).sub;
    return this.authService.logout(userId);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('cleanup-tokens')
  async cleanupTokens(@Req() req: Request) {
    // Simple admin check - you can enhance this based on your user model
    const user = req.user as any;
    if (!user.roles || !user.roles.includes('admin')) {
      throw new Error('Admin access required');
    }
    return this.authService.cleanupAllExpiredTokens();
  }
}