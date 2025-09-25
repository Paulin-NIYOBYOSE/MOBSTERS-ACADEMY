import { Controller, Get, Post, Body, UseGuards, Req, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
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
    const userId = (req.user as any).id;
    return this.courseService.uploadCourse(body.title, body.content, body.roleAccess, userId);
  }

  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { title: string; content: string; roleAccess: string[] },
  ) {
    return this.courseService.updateCourse(id, body.title, body.content, body.roleAccess);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async deleteCourse(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.deleteCourse(id);
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
    const userId = (req.user as any).id;
    return this.courseService.uploadLiveSession(body.title, body.description, new Date(body.date), body.roleAccess, userId);
  }

  @Put('live-session/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async updateLiveSession(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { title: string; description: string; date: string; roleAccess: string[] },
  ) {
    return this.courseService.updateLiveSession(id, body.title, body.description, new Date(body.date), body.roleAccess);
  }

  @Delete('live-session/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async deleteLiveSession(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.deleteLiveSession(id);
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
    const userId = (req.user as any).id;
    return this.courseService.uploadSignal(body.title, body.content, body.roleAccess, userId);
  }

  @Put('signal/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async updateSignal(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { title: string; content: string; roleAccess: string[] },
  ) {
    return this.courseService.updateSignal(id, body.title, body.content, body.roleAccess);
  }

  @Delete('signal/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async deleteSignal(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.deleteSignal(id);
  }

  @Get('signals')
  @UseGuards(JwtGuard)
  async getSignals(@Req() req: Request) {
    const userRoles = (req.user as any).roles;
    return this.courseService.getSignals(userRoles);
  }
}