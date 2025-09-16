import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AssignRolesDto } from './dto/assign-roles.dto';

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
}