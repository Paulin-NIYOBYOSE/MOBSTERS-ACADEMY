import { Controller, Get, Post, Body, UseGuards, Req, Put, Param, ParseIntPipe, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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

  // Course videos (series)
  @Get(':id/videos')
  @UseGuards(JwtGuard)
  async getCourseVideos(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userRoles = (req.user as any).roles;
    return this.courseService.getCourseVideos(id, userRoles);
  }

  @Post(':id/videos')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async addVideo(
    @Param('id', ParseIntPipe) courseId: number,
    @Body() body: { title: string; description?: string; videoUrl: string; durationSec?: number; orderIndex?: number },
  ) {
    return this.courseService.addCourseVideo(courseId, body);
  }

  // Upload video file variant (multipart/form-data)
  @Post(':id/videos/file')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      limits: { fileSize: 1024 * 1024 * 1024 }, // up to 1GB
    }),
  )
  async addVideoFile(
    @Param('id', ParseIntPipe) courseId: number,
    @UploadedFile() file: any,
    @Body() body: { title: string; description?: string; orderIndex?: number },
  ) {
    const videoUrl = `/uploads/videos/${file.filename}`;
    return this.courseService.addCourseVideo(courseId, {
      title: body.title,
      description: body.description,
      videoUrl,
      orderIndex: body.orderIndex,
    });
  }

  @Put(':courseId/videos/:videoId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async updateVideo(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
    @Body() body: { title?: string; description?: string; videoUrl?: string; durationSec?: number; orderIndex?: number },
  ) {
    return this.courseService.updateCourseVideo(courseId, videoId, body);
  }

  @Delete(':courseId/videos/:videoId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async deleteVideo(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
  ) {
    return this.courseService.deleteCourseVideo(courseId, videoId);
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