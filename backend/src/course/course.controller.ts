import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CourseService } from './course.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request } from 'express';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async uploadCourse(@Body() body: { title: string; content: string; roleAccess: string[] }, @Req() req: Request) {
    const userId = (req.user as any).sub;
    return this.courseService.uploadCourse(body.title, body.content, body.roleAccess, userId);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getCourses(@Req() req: Request) {
    const userRoles = (req.user as any).roles;
    return this.courseService.getCourses(userRoles);
  }

  @Post('live-session')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async uploadLiveSession(@Body() body: { title: string; description: string; date: string; roleAccess: string[] }, @Req() req: Request) {
    const userId = (req.user as any).sub;
    return this.courseService.uploadLiveSession(body.title, body.description, new Date(body.date), body.roleAccess, userId);
  }

  @Get('live-sessions')
  @UseGuards(JwtGuard)
  async getLiveSessions(@Req() req: Request) {
    const userRoles = (req.user as any).roles;
    return this.courseService.getLiveSessions(userRoles);
  }

  @Post('signal')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async uploadSignal(@Body() body: { title: string; content: string; roleAccess: string[] }, @Req() req: Request) {
    const userId = (req.user as any).sub;
    return this.courseService.uploadSignal(body.title, body.content, body.roleAccess, userId);
  }

  @Get('signals')
  @UseGuards(JwtGuard)
  async getSignals(@Req() req: Request) {
    const userRoles = (req.user as any).roles;
    return this.courseService.getSignals(userRoles);
  }
}