import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Req, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { Request } from 'express';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/users')
  async listUsers() {
    return this.usersService.listUsers();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/users/:id/roles')
  async assignRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignRolesDto,
  ) {
    return this.usersService.assignRoles(id, dto.roles);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @Get('role-requests')
  async getPendingRoleRequests() {
    return this.usersService.getPendingRoleRequests();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @Post('role-requests/:id/approve')
  async approveRoleRequest(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.approveRoleRequest(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @Post('role-requests/:id/reject')
  async rejectRoleRequest(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.rejectRoleRequest(id);
  }

  @UseGuards(JwtGuard)
  @Post('role-requests')
  async createRoleRequest(@Body() body: { program: 'academy' | 'mentorship' }, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.usersService.createRoleRequest(userId, body.program);
  }

  @UseGuards(JwtGuard)
  @Get('me/role-requests')
  async getMyRoleRequests(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.usersService.getUserRoleRequests(userId);
  }
}