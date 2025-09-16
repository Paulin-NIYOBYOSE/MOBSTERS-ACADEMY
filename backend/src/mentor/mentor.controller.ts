import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('mentor')
export class MentorController {
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('mentor', 'admin')
  @Get('dashboard')
  async dashboard() {
    return { message: 'Welcome to the mentor dashboard' };
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('mentorship_student', 'mentor', 'admin')
  @Get('mentorship-content')
  async getMentorshipContent() {
    return { message: 'Mentorship program: personalized sessions', sessions: ['1:1 Trading Review', 'Custom Strategy'] };
  }
}