import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('community')
export class CommunityController {
  @Get('content')
  @UseGuards(JwtGuard)
  async getCommunityContent() {
    return { message: 'Free community content: signals and forums', courses: ['Basic Signals', 'Community Forum'] };
  }
}