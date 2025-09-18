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

async getCourses(userRoles: string[]) {
  return this.prisma.course.findMany({
    where: {
      roleAccess: {
        hasSome: userRoles,
      },
    },
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

async getLiveSessions(userRoles: string[]) {
  return this.prisma.liveSession.findMany({
    where: {
      roleAccess: {
        hasSome: userRoles,
      },
    },
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

async getSignals(userRoles: string[]) {
  return this.prisma.signal.findMany({
    where: {
      roleAccess: {
        hasSome: userRoles,
      },
    },
  });
}
}