import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateUserRoleDto } from './dtos/create-user-role.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Role)
    private roleService: Repository<Role>,

    @InjectRepository(User)
    private userService: Repository<User>
  ){}

  async create(createRoleDto: CreateRoleDto) {
    const roleExisted = await this.roleService.findOne({
      where: {
        name: createRoleDto.name
      },
    });

    if(roleExisted) throw new BadRequestException('Role existed');

    const name = createRoleDto.name;
    const description = createRoleDto.description;


    const newRole = this.roleService.create({
      name: name,
      description: description
    })

    await this.roleService.save(newRole);

    return newRole;

  }

  async createUserRole(createUserRoleDto: CreateUserRoleDto) {
    const user = await this.userService.findOne({
      where: {
        id: createUserRoleDto.UserId,
      },
    });

    if(!user) throw new NotFoundException('User with that ID not exist');

    const role = await this.roleService.findOne({
      where: {
        id: createUserRoleDto.RoleId,
      },
    });

    if(!role) throw new NotFoundException('Role with that ID not exist');

    user.roles.push(role);

    await this.userService.save( user);

    return {message: "Add successfully"};
  }

  async deleteUserRole(createUserRoleDto: CreateUserRoleDto){
    const user = await this.userService.findOne({
      where: {
        id: createUserRoleDto.UserId,
      },
    });

    if(!user) throw new NotFoundException('User with that ID not exist');

    const roles = user.roles.filter((role: Role) => {
      return role.id != createUserRoleDto.RoleId;
    });

    user.roles = roles;

    await this.userService.save(user);
    return {message: "Deleted successfully !!!"};
  }

  async findAll() {
    const allRoles = await this.roleService.find();

    if(!allRoles || allRoles.length === 0) throw new BadRequestException('No role is available in the DB');

    return allRoles;
  }

  async findOne(id: string) {
    const roleExisted = await this.roleService.findOne({
      where: {
        id: id
      },
    });

    if(!roleExisted) throw new NotFoundException('Role not exist');

    return roleExisted;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    let roleExisted = await this.roleService.findOne({
      where: {
        id: id
      },
    });
    
    if(!roleExisted) throw new NotFoundException('Role with that ID not exist');

    roleExisted = {...roleExisted, ...updateRoleDto};

    await this.roleService.save(roleExisted);

    return {message: "Update successfully !!!"};
  }

  async remove(id: string) {
    await this.roleService.delete(id);
    return {message: "Delete successfully !!!"};
  }

}
