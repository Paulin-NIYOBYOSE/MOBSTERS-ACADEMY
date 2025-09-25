import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserRoles(userId: number): Promise<string[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    return userRoles.map((ur) => ur.role.name);
  }

  async listUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async assignRoles(userId: number, roleNames: string[]) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = await this.prisma.role.findMany({ where: { name: { in: roleNames } } });
    if (roles.length !== roleNames.length) {
      throw new BadRequestException('Invalid role names');
    }

    await this.prisma.userRole.deleteMany({ where: { userId } });
    await this.prisma.userRole.createMany({
      data: roles.map((role) => ({ userId, roleId: role.id })),
    });

    return { message: 'Roles assigned successfully' };
  }

  async getPendingRoleRequests() {
    return this.prisma.pendingRoleRequest.findMany({
      where: { status: { in: ['pending', 'paid'] } },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
  }

  async approveRoleRequest(requestId: number) {
    const request = await this.prisma.pendingRoleRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });
    if (!request) throw new NotFoundException('Request not found');

    const roleMap = {
      academy: 'academy_student',
      mentorship: 'mentorship_student',
    } as Record<string, string>;

    const role = await this.prisma.role.findUnique({ where: { name: roleMap[request.program] } });
    if (!role) throw new BadRequestException('Invalid program');

    // Check if user already has this role to avoid duplicates
    const existingUserRole = await this.prisma.userRole.findUnique({
      where: { 
        userId_roleId: { 
          userId: request.userId, 
          roleId: role.id 
        } 
      },
    });

    if (!existingUserRole) {
      await this.prisma.userRole.create({
        data: { userId: request.userId, roleId: role.id },
      });
    }

    await this.prisma.pendingRoleRequest.update({
      where: { id: requestId },
      data: { status: 'approved' },
    });

    return { message: 'Role assigned successfully' };
  }

  async rejectRoleRequest(requestId: number) {
    const request = await this.prisma.pendingRoleRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Request not found');

    await this.prisma.pendingRoleRequest.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    });

    return { message: 'Request rejected' };
  }

  async createRoleRequest(userId: number, program: 'academy' | 'mentorship') {
    const existing = await this.prisma.pendingRoleRequest.findFirst({
      where: { userId, program, status: { in: ['pending', 'paid', 'approved'] } },
    });
    if (existing && existing.status !== 'rejected') {
      return { message: 'Request already exists', requestId: existing.id, status: existing.status };
    }

    const created = await this.prisma.pendingRoleRequest.create({
      data: { userId, program, status: 'pending' },
    });
    return { message: 'Request submitted', requestId: created.id, status: created.status };
  }

  async getUserRoleRequests(userId: number) {
    return this.prisma.pendingRoleRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}