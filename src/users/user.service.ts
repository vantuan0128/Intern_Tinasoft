import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/base/services/base.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions, Repository } from 'typeorm';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { Request } from 'express';
import * as bcrypt from "bcrypt";
import userFactory from 'src/database/factories/user.factory';
import UserSeeder from 'src/database/seeds/user.seeder';
import { SeederOptions, runSeeders } from 'typeorm-extension';
import { UpdateUserDto } from './dtos/update-user.dto';

const saltOrRounds = 10;
@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super(userRepository);
    }

    isValidate(dateString: string): boolean {
        const regex = /^\d{4}-\d{2}-\d{2}$/;

        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return false;
        }

        const parts = dateString.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);

        if (year < 0 || month < 1 || month > 12 || day < 1 || day > 31) {
            return false;
        }

        return true;
    }

    formatDateString(dateString: string): string {
        const parts = dateString.split('-');

        const month = parts[1].length === 1 ? '0' + parts[1] : parts[1];
        const day = parts[2].length === 1 ? '0' + parts[2] : parts[2];

        return `${parts[0]}-${month}-${day}`;
    }

    async adminRecoverPassword(id: string) {
        try {
            const user = await this.findById(id);

            if (!user) {
                throw new BadGatewayException('User not found');
            }

            const newPassword = await bcrypt.hash('aaaaa', 10);

            return await this.update(user.id, { password: newPassword });
        } catch (error) {
            throw new BadRequestException();
        }
    }

    async changePassword(changePasswordDto: ChangePasswordDto, req: Request) {
        const token = req['user'];

        const userExisted = await this.findById(token.id);

        if (!userExisted) return { message: "User not found !!!" };

        const oldPassword = changePasswordDto.password;
        const newPassword = changePasswordDto.newPassword;

        const checkOldPass = await bcrypt.compare(oldPassword, userExisted.password);

        if (!checkOldPass) throw new BadRequestException('Your password is not correct');

        const checkNewPass = await bcrypt.compare(newPassword, userExisted.password);

        if (checkNewPass) throw new BadRequestException('Your new password must be different from the old password');

        const hashPassword = await bcrypt.hash(
            newPassword,
            saltOrRounds,
        );

        userExisted.password = hashPassword;

        await this.store(userExisted);

        return { message: "Updated successfully" };
    }

    async getUsersByBirthday(getUsersByBirthday: UpdateUserDto) {
        const date = getUsersByBirthday.date;

        if (!date) throw new BadRequestException('Empty date provided. Please fill in');

        const users = await this.userRepository
            .createQueryBuilder('user')
            .where('DATE(user.birthday) = :date', { date })
            .orderBy('user.birthday', 'ASC')
            .getMany();

        if (!users || users.length === 0) throw new NotFoundException(`No users found for date of birth ${date}`);

        const sanitizedUsers = users.map(user => {
            const { password, refresh_token, email, otp, ...sanitizedUsers } = user;
            return sanitizedUsers;
        });

        return sanitizedUsers;
    }

    async createSeeder() {
        const options: DataSourceOptions & SeederOptions = {
            type: 'postgres',
            port: 5432,
            host: 'localhost',
            username: 'postgres',
            password: '12345',
            database: 'api',
            entities: [User],

            seeds: [UserSeeder],
            factories: [userFactory]
        };

        const dataSource = new DataSource(options);
        await dataSource.initialize();

        await runSeeders(dataSource);
    }
}

