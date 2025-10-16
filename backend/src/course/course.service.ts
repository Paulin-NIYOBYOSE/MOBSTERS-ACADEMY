import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

async uploadCourse(title: string, content: string, roleAccess: string[], uploadedBy: number) {
  const validRoles = await this.prisma.role.findMany({ where: { name: { in: roleAccess } } });
  if (validRoles.length !== roleAccess.length) {
    throw new BadRequestException('Invalid roles in roleAccess');
  }

  return this.prisma.course.create({
    data: {
      title,
      content,
      roleAccess,
      uploadedBy,
    },
  });
}

async updateCourse(id: number, title: string, content: string, roleAccess: string[]) {
  const validRoles = await this.prisma.role.findMany({ where: { name: { in: roleAccess } } });
  if (validRoles.length !== roleAccess.length) {
    throw new BadRequestException('Invalid roles in roleAccess');
  }

  return this.prisma.course.update({
    where: { id },
    data: { title, content, roleAccess },
  });
}

async deleteCourse(id: number) {
  return this.prisma.course.delete({ where: { id } });
}

async getCourses(userRoles: string[]) {
  // If user is admin, return all courses
  if (userRoles.includes('admin')) {
    return this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
  
  // For non-admin users, filter by role access
  return this.prisma.course.findMany({
    where: {
      roleAccess: {
        hasSome: userRoles,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async uploadLiveSession(title: string, description: string, date: Date, roleAccess: string[], uploadedBy: number) {
  const validRoles = await this.prisma.role.findMany({ where: { name: { in: roleAccess } } });
  if (validRoles.length !== roleAccess.length) {
    throw new BadRequestException('Invalid roles in roleAccess');
  }

  return this.prisma.liveSession.create({
    data: {
      title,
      description,
      date,
      roleAccess,
      uploadedBy,
    },
  });
}

async updateLiveSession(id: number, title: string, description: string, date: Date, roleAccess: string[]) {
  const validRoles = await this.prisma.role.findMany({ where: { name: { in: roleAccess } } });
  if (validRoles.length !== roleAccess.length) {
    throw new BadRequestException('Invalid roles in roleAccess');
  }

  return this.prisma.liveSession.update({
    where: { id },
    data: { title, description, date, roleAccess },
  });
}

async deleteLiveSession(id: number) {
  return this.prisma.liveSession.delete({ where: { id } });
}

async getLiveSessions(userRoles: string[]) {
  // If user is admin, return all live sessions
  if (userRoles.includes('admin')) {
    return this.prisma.liveSession.findMany({
      orderBy: { date: 'desc' },
    });
  }
  
  // For non-admin users, filter by role access
  return this.prisma.liveSession.findMany({
    where: {
      roleAccess: {
        hasSome: userRoles,
      },
    },
    orderBy: { date: 'desc' },
  });
}

async uploadSignal(title: string, content: string, roleAccess: string[], uploadedBy: number) {
  const validRoles = await this.prisma.role.findMany({ where: { name: { in: roleAccess } } });
  if (validRoles.length !== roleAccess.length) {
    throw new BadRequestException('Invalid roles in roleAccess');
  }

  return this.prisma.signal.create({
    data: {
      title,
      content,
      roleAccess,
      uploadedBy,
    },
  });
}

async updateSignal(id: number, title: string, content: string, roleAccess: string[]) {
  const validRoles = await this.prisma.role.findMany({ where: { name: { in: roleAccess } } });
  if (validRoles.length !== roleAccess.length) {
    throw new BadRequestException('Invalid roles in roleAccess');
  }

  return this.prisma.signal.update({
    where: { id },
    data: { title, content, roleAccess },
  });
}

async deleteSignal(id: number) {
  return this.prisma.signal.delete({ where: { id } });
}
async getSignals(userRoles: string[]) {
  // If user is admin, return all signals
  if (userRoles.includes('admin')) {
    return this.prisma.signal.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
  
  // For non-admin users, filter by role access
  return this.prisma.signal.findMany({
    where: {
      roleAccess: {
        hasSome: userRoles,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async getCourseVideos(courseId: number, userRoles: string[]) {
  const course = await this.prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    throw new BadRequestException('Course not found');
  }
  // Basic guard: ensure user has access to this course
  const allowed = course.roleAccess.some((r) => userRoles.includes(r));
  if (!allowed) {
    throw new BadRequestException('Access denied');
  }

  const prismaAny = this.prisma as any;
  return prismaAny.courseVideo.findMany({
    where: { courseId },
    orderBy: { orderIndex: 'asc' },
  });
}

async addCourseVideo(courseId: number, body: { title: string; description?: string; videoUrl: string; durationSec?: number; orderIndex?: number }) {
  // Ensure course exists
  const course = await this.prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new BadRequestException('Course not found');

  // Default orderIndex to next available
  let orderIndex = body.orderIndex ?? 0;
  if (body.orderIndex === undefined) {
  const prismaAny1 = this.prisma as any;
  const maxOrder = await prismaAny1.courseVideo.aggregate({
      where: { courseId },
      _max: { orderIndex: true },
    });
    orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;
  }

  const prismaAnyCreate = this.prisma as any;
  return prismaAnyCreate.courseVideo.create({
    data: {
      courseId,
      title: body.title,
      description: body.description ?? null,
      videoUrl: body.videoUrl,
      durationSec: body.durationSec ?? null,
      orderIndex,
    },
  });
}

async updateCourseVideo(courseId: number, videoId: number, body: { title?: string; description?: string; videoUrl?: string; durationSec?: number; orderIndex?: number }) {
  // Ensure episode belongs to course
  const prismaAny2 = this.prisma as any;
  const video = await prismaAny2.courseVideo.findUnique({ where: { id: videoId } });
  if (!video || video.courseId !== courseId) throw new BadRequestException('Video not found');

  return prismaAny2.courseVideo.update({
    where: { id: videoId },
    data: {
      title: body.title ?? video.title,
      description: body.description ?? video.description,
      videoUrl: body.videoUrl ?? video.videoUrl,
      durationSec: body.durationSec ?? video.durationSec,
      orderIndex: body.orderIndex ?? video.orderIndex,
    },
  });
}

async deleteCourseVideo(courseId: number, videoId: number) {
  const prismaAny3 = this.prisma as any;
  const video = await prismaAny3.courseVideo.findUnique({ where: { id: videoId } });
  if (!video || video.courseId !== courseId) throw new BadRequestException('Video not found');
  return prismaAny3.courseVideo.delete({ where: { id: videoId } });
}
}