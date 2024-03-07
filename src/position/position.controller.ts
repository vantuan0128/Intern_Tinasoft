import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dtos/create-position.dto';
import { UpdatePositionDto } from './dtos/update-position.dto';
import { CreateUserPositionDto } from './dtos/create-user-position.dto';
import { Role } from 'src/enums/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/guards/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Position } from 'src/enums/position.enum';
import { PositionsGuard } from 'src/auth/guards/positions.guard';
import { Positions } from 'src/auth/guards/decorators/positions.decorator';

@ApiTags('position')
@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Roles(Role.Admin, Role.Superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('add-new-position')
  create(
    @Body() createPositionDto: CreatePositionDto
  ) {
    return this.positionService.create(createPositionDto);
  }

  @Positions(Position.Manager, Position.Director)
  @UseGuards(AuthGuard, PositionsGuard)
  @Post('add-user-position')
  createUserPosition(
    @Body() createUserPositionDto: CreateUserPositionDto
  ){
    return this.positionService.createUserPosition(createUserPositionDto);
  }

  @Positions(Position.Manager, Position.Director)
  @UseGuards(AuthGuard, PositionsGuard)
  @Get('get-all-positions')
  findAll() {
    return this.positionService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.positionService.findOne(id);
  }

  @Roles(Role.Admin, Role.Superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updatePositionDto: UpdatePositionDto
  ){
    return this.positionService.update(id, updatePositionDto);
  }

  @Roles(Role.Admin, Role.Superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string
  ) {
    return this.positionService.remove(id);
  }

  @Positions(Position.Manager, Position.Director)
  @UseGuards(AuthGuard, PositionsGuard)
  @Post('delete-user-position')
  deleteUserPosition(
    @Body() createUserPosition: CreateUserPositionDto
  ){
    return this.positionService.deleteUserPosition(createUserPosition);
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         

}
