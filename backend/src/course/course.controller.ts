import { Controller, Get, Post, Body, UseGuards, Req, Put, Param, ParseIntPipe, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CourseService } from './course.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post()
  @UseGuards(JwtGuard)
  async uploadCourse(@Body() body: { title: string; content: string; roleAccess: string[] }, @Req() req: Request) {
    const user = req.user as any;
    if (!user.roles || !user.roles.includes('admin')) {
      throw new Error('Admin access required');
    }
    const userId = user.id;
    return this.courseService.uploadCourse(body.title, body.content, body.roleAccess, userId);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { title: string; content: string; roleAccess: string[] },
    @Req() req: Request
  ) {
    const user = req.user as any;
    if (!user.roles || !user.roles.includes('admin')) {
      throw new Error('Admin access required');
    }
    return this.courseService.updateCourse(id, body.title, body.content, body.roleAccess);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteCourse(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as any;
    if (!user.roles || !user.roles.includes('admin')) {
      throw new Error('Admin access required');
    }
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
  @UseGuards(JwtGuard)
  async addVideo(
    @Param('id', ParseIntPipe) courseId: number,
    @Body() body: { title: string; description?: string; videoUrl: string; durationSec?: number; orderIndex?: number },
    @Req() req: Request
  ) {
    const user = req.user as any;
    if (!user.roles || !user.roles.includes('admin')) {
      throw new Error('Admin access required');
    }
    return this.courseService.addCourseVideo(courseId, body);
  }

  // Upload video file variant (multipart/form-data)
  @Post(':id/videos/file')
  @UseGuards(JwtGuard)
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
  @UseGuards(JwtGuard)
    async updateVideo(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
    @Body() body: { title?: string; description?: string; videoUrl?: string; durationSec?: number; orderIndex?: number },
  ) {
    return this.courseService.updateCourseVideo(courseId, videoId, body);
  }

  @Delete(':courseId/videos/:videoId')
  @UseGuards(JwtGuard)
    async deleteVideo(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
  ) {
    return this.courseService.deleteCourseVideo(courseId, videoId);
  }

  @Post('live-session')
  @UseGuards(JwtGuard)
    async uploadLiveSession(@Body() body: { 
    title: string; 
    description: string; 
    date: string; 
    roleAccess: string[];
    duration?: number;
    maxParticipants?: number;
    autoRecord?: boolean;
  }, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.courseService.uploadLiveSession(
      body.title, 
      body.description, 
      new Date(body.date), 
      body.roleAccess, 
      userId,
      body.duration,
      body.maxParticipants,
      body.autoRecord
    );
  }

  @Put('live-session/:id')
  @UseGuards(JwtGuard)
    async updateLiveSession(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { title: string; description: string; date: string; roleAccess: string[] },
  ) {
    return this.courseService.updateLiveSession(id, body.title, body.description, new Date(body.date), body.roleAccess);
  }

  @Delete('live-session/:id')
  @UseGuards(JwtGuard)
    async deleteLiveSession(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.deleteLiveSession(id);
  }

  @Get('live-sessions')
  @UseGuards(JwtGuard)
  async getLiveSessions(@Req() req: Request) {
    const user = req.user as any;
    const userRoles = user.roles ? user.roles.map((r: any) => r.role?.name || r.name || r) : ['free'];
    return this.courseService.getLiveSessions(userRoles);
  }

  @Get('upcoming-live-sessions')
  @UseGuards(JwtGuard)
  async getUpcomingAndLiveSessions(@Req() req: Request) {
    const user = req.user as any;
    const userRoles = user.roles ? user.roles.map((r: any) => r.role?.name || r.name || r) : ['free'];
    console.log('User roles for live sessions:', userRoles);
    return this.courseService.getUpcomingAndLiveSessions(userRoles);
  }


  @Post('signal')
  @UseGuards(JwtGuard)
    async uploadSignal(@Body() body: { title: string; content: string; roleAccess: string[] }, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.courseService.uploadSignal(body.title, body.content, body.roleAccess, userId);
  }

  @Put('signal/:id')
  @UseGuards(JwtGuard)
    async updateSignal(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { title: string; content: string; roleAccess: string[] },
  ) {
    return this.courseService.updateSignal(id, body.title, body.content, body.roleAccess);
  }

  @Delete('signal/:id')
  @UseGuards(JwtGuard)
    async deleteSignal(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.deleteSignal(id);
  }

  @Get('signals')
  @UseGuards(JwtGuard)
  async getSignals(@Req() req: Request) {
    const userRoles = (req.user as any).roles;
    return this.courseService.getSignals(userRoles);
  }

  // Live Session Control Endpoints
  @Post('live-session/:id/start')
  @UseGuards(JwtGuard)
    async startLiveSession(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.courseService.startLiveSession(id, userId);
  }

  @Post('live-session/:id/end')
  @UseGuards(JwtGuard)
    async endLiveSession(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.courseService.endLiveSession(id, userId);
  }

  @Post('live-session/:id/join')
  @UseGuards(JwtGuard)
  async joinLiveSession(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.courseService.joinLiveSession(id, userId);
  }

  @Post('live-session/:id/leave')
  @UseGuards(JwtGuard)
  async leaveLiveSession(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.courseService.leaveLiveSession(id, userId);
  }

  @Get('live-session/:id/participants')
  @UseGuards(JwtGuard)
  async getSessionParticipants(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.getSessionParticipants(id);
  }

  @Put('live-session/:id/participants/:participantId/permissions')
  @UseGuards(JwtGuard)
    async updateParticipantPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Param('participantId') participantId: string,
    @Body() permissions: any,
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    return this.courseService.updateParticipantPermissions(id, participantId, permissions, userId);
  }

  @Delete('live-session/:id/participants/:participantId')
  @UseGuards(JwtGuard)
    async kickParticipant(
    @Param('id', ParseIntPipe) id: number,
    @Param('participantId') participantId: string,
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    return this.courseService.kickParticipant(id, participantId, userId);
  }

  @Get('live-session/:id/analytics')
  @UseGuards(JwtGuard)
    async getSessionAnalytics(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.getSessionAnalytics(id);
  }

  @Post('live-session/:id/feedback')
  @UseGuards(JwtGuard)
  async submitSessionFeedback(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { rating: number; comment?: string; categories?: any },
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    return this.courseService.submitSessionFeedback(id, userId, body.rating, body.comment, body.categories);
  }

  @Get('live-session/:id/feedback')
  @UseGuards(JwtGuard)
  async getSessionFeedback(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.getSessionFeedback(id);
  }

  @Post('live-session/:id/cleanup-participants')
  @UseGuards(JwtGuard)
    async cleanupSessionParticipants(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.cleanupSessionParticipants(id);
  }

  @Get('live-session/:id/participant-count')
  @UseGuards(JwtGuard)
  async getActiveParticipantCount(@Param('id', ParseIntPipe) id: number) {
    return { count: await this.courseService.getActiveParticipantCount(id) };
  }
}