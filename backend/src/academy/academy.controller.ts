import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('academy')
export class AcademyController {
  @Get('content')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('academy_student', 'admin')
  async getAcademyContent() {
    return { message: 'Academy courses: videos, strategies', courses: ['Technical Analysis', 'Risk Management'] };
  }
}