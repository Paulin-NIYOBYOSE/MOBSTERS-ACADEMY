import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PendingRoleRequest } from '@prisma/client'; // optional, for type hints

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
    if (!user) throw new NotFoundException('User not found');

    const roles = await this.prisma.role.findMany({ where: { name: { in: roleNames } } });
    if (roles.length !== roleNames.length)
      throw new BadRequestException('Invalid role names');

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
      free: 'community_student',
      academy: 'academy_student',
      mentorship: 'mentorship_student',
    };

    const role = await this.prisma.role.findUnique({
      where: { name: roleMap[request.program] },
    });
    if (!role) throw new BadRequestException('Invalid program');

    await this.prisma.userRole.create({
      data: { userId: request.userId, roleId: role.id },
    });

    await this.prisma.pendingRoleRequest.update({
      where: { id: requestId },
      data: { status: 'approved' },
    });

    return { message: 'Role assigned successfully' };
  }
}
