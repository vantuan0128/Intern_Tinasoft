import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { CreateUserRoleDto } from './dtos/create-user-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Position } from 'src/enums/position.enum';
import { PositionsGuard } from 'src/auth/guards/positions.guard';
import { Positions } from 'src/auth/guards/decorators/positions.decorator';
import { Roles } from 'src/auth/guards/decorators/roles.decorator';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Roles(Role.Admin, Role.Superadmin)  
  @UseGuards(AuthGuard, RolesGuard)
  @Post('add-new-role')
  create(
    @Body() createRoleDto: CreateRoleDto
  ){
    return this.roleService.create(createRoleDto);
  }

  @Positions(Position.Manager, Position.Director)
  @UseGuards(AuthGuard, PositionsGuard)
  @Post('add-user-role')
  createUserRole(
    @Body() createUserRoleDto: CreateUserRoleDto,
  ){
    return this.roleService.createUserRole(createUserRoleDto);
  }

  @Get('get-all-roles')
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ){
    return this.roleService.findOne(id);
  }

  @Roles(Role.Admin, Role.Superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateRoleDto: UpdateRoleDto
  ){
    return this.roleService.update(id, updateRoleDto);
  }

  @Roles(Role.Admin, Role.Superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string
  ) {
    return this.roleService.remove(id);
  }

  @Roles(Role.Admin, Role.Superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('delete-user-role')
  deleteUserRole(
    @Body() createUserRoleDto : CreateUserRoleDto
  ){
    return this.roleService.deleteUserRole(createUserRoleDto);
  }
}
