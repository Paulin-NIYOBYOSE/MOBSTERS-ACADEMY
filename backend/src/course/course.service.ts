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
  return this.prisma.signal.findMany({
    where: {
      roleAccess: {
        hasSome: userRoles,
      },
    },
  });
}
}