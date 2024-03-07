import { Controller, Post, Body, Res, Req, Get, Patch, UseGuards, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/guards/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('api')
@Controller('api')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }


  @Roles(Role.Superadmin, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('admin/findAll')
  findAll() {
    return this.userService.index();
  }

  @Roles(Role.Superadmin, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('admin/users/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Roles(Role.Superadmin, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('date')
  getUserByBirthday(
    @Body() dateOfBirth: UpdateUserDto,
  ){
    return this.userService.getUsersByBirthday(dateOfBirth);
  }


  @Roles(Role.Admin, Role.Superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('admin/user/recover-password/:id')
  async recoverUserPassword(
    @Param('id') id: string,
  ) {
    return await this.userService.adminRecoverPassword(id);
    // return true;
  }

  @Roles(Role.Admin, Role.Superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('admin/delete-user/:id')
  remove(
    @Param('id') id: string
  ) {
    return this.userService.delete(id);
  }

  @UseGuards(AuthGuard)
  @Patch('edit-yourself')
  updateYourSelf(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ){
    return this.userService.update(req['user'].id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('get-profile')
  getProfile(
    @Req() req: Request,
  ) {
    return this.userService.findById(req['user'].id);
  }

  @UseGuards(AuthGuard)
  @Post('change-my-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    return this.userService.changePassword(changePasswordDto, req);
  }

  // @Post('seeding')
  // createSeeder(){
  //   return this.adminService.createSeeder();
  // }

}
