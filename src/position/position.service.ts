import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dtos/create-position.dto';
import { UpdatePositionDto } from './dtos/update-position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { Repository } from 'typeorm';
import { CreateUserPositionDto } from './dtos/create-user-position.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PositionService {

  constructor(
    @InjectRepository(Position)
    private positionService : Repository<Position>,

    @InjectRepository(User)
    private userService : Repository<User>
  ){}

  async create(createPositionDto: CreatePositionDto) {
    const positionExisted = await this.positionService.findOne({
      where: {
        name: createPositionDto.name,
      },
    });

    if(positionExisted) throw new BadRequestException('Position existed');

    const name = createPositionDto.name;
    const description = createPositionDto.description;


    const newPositon = this.positionService.create({
      name: name,
      description: description
    });

    await this.positionService.save(newPositon);
    return newPositon;
  }

  async findAll() {
    const allPositions = await this.positionService.find();

    if(!allPositions || allPositions.length === 0) throw new NotFoundException('No position is available in the DB');

    return allPositions;
  }

  async findOne(id: string) {
    const positionExisted = await this.positionService.findOne({
      where: {
        id: id
      },
    });

    if(!positionExisted) throw new NotFoundException('Position not exist');

    return positionExisted;
  }

  async update(id: string, updatePositionDto: UpdatePositionDto) {
    let positionExisted = await this.positionService.findOne({
      where: {
        id: id
      },
    });
    
    if(!positionExisted) throw new NotFoundException('Position with that id not exist');

    positionExisted = {...positionExisted, ...updatePositionDto};

    await this.positionService.save(positionExisted);

    return {message: "Update successfully !!!"};
  }

  async remove(id: string) {
    await this.positionService.delete(id);
    return {message: "Delete successfully !!!"};
  }

  async createUserPosition(createUserPositionDto: CreateUserPositionDto) {
    const user = await this.userService.findOne({
      where: {
        id: createUserPositionDto.UserId,
      },
    });

    if(!user) throw new NotFoundException('User with that ID not exist');

    const position = await this.positionService.findOne({
      where: {
        id: createUserPositionDto.PositionId,
      },
    });

    if(!position) throw new NotFoundException('Position with that ID not exist');

    user.positions.push(position);

    await this.userService.save(user);

  }

  async deleteUserPosition(createUserPositionDto: CreateUserPositionDto) {
    const user = await this.userService.findOne({
      where: {
        id: createUserPositionDto.UserId,
      },
    });

    if(!user) throw new NotFoundException('User with that ID not exist');

    const positions = user.positions.filter((position: Position) => {
      return position.id != createUserPositionDto.PositionId;
    })

    user.positions = positions;

    await this.userService.save(user);

    return {message: "Deleted successfully !!!"};
  }
}
