import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User]),
    JwtModule 
    ],
  controllers: [RoleController],
  providers: [RoleService, UserService],
  exports: [RoleService]
})
export class RoleModule {}
