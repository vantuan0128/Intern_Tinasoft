import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { LoginAuthDto } from './dto/login-auth.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as nodemailer from 'nodemailer';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { RoleService } from 'src/role/role.service';

const saltOrRounds = 10;
@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    protected userService: Repository<User>,

    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async create(createUserDto: CreateAuthDto) {
    const userExisted = await this.userService.findOne({
      where: {
        email: createUserDto.email,
      }
    });

    if (userExisted) throw new BadRequestException('User with that email has existed !!!');

    const hashPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    )

    const newUser = this.userService.create({
      email: createUserDto.email,
      password: hashPassword,
      fullName: createUserDto.fullName,
    });

    await this.userService.save(newUser);

    return {
      message: "Create successfully",
      id: newUser.id,
    }
  }

  async login(loginUserDto: LoginAuthDto, res: Response) {
    const userExisted = await this.userService.findOne({
      where: {
        email: loginUserDto.email,
      }
    });
    if (!userExisted) throw new NotFoundException('Cannot found user with that email');

    const isMatched = await bcrypt.compare(loginUserDto.password, userExisted.password);

    if (!isMatched) throw new BadRequestException('Incorrect password, try again !!!');

    const payload = { id: userExisted.id };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('ACCESS_KEY'),
      expiresIn: '15m'
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_KEY'),
      expiresIn: '7d'
    });

    await this.userService.update(
      {
        id: userExisted.id,
      },
      {
        refresh_token: refresh_token,
      },
    );

    res.cookie('access_token', access_token,
      {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        expires: new Date(Date.now() + 15 * 60 * 1000),
      }
    );

    return {
      access_token,
      refresh_token,
    };
  }

  async logout(req: Request, res: Response) {
    const token = req['user'];

    const user = await this.userService.findOne({
      where: {
        id: token.id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.userService.update(
      {
        id: user.id,
      }, {
      refresh_token: null,
    }
    );

    res.clearCookie('access_token');

    return { message: "Logged out" };
  }

  async sendOTP(email: string) {
    const generatedOTP = (Math.floor(100000 + Math.random() * 900000)).toString();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('GMAIL_NAME'),
        pass: this.configService.get('GMAIL_PASS'),
      },
    });

    const mailOptions = {
      from: this.configService.get('GMAIL_NAME'),
      to: email,
      subject: 'OTP to change password',
      text: `Your OTP is: ${generatedOTP}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log('Error sending OTP: ', err);
      } else {
        console.log('Email sent: ', info.response);
      }
    });

    const user = await this.userService.findOne({
      where: {
        email: email,
      },
    });

    if (!user) throw new NotFoundException('User not exist');

    user.otp = generatedOTP;

    await this.userService.save(user);

    return { message: "Sent successfully !!!" };
  }

  async refreshToken(req: Request, res: Response) {
    const token = req['user'];

    const user = await this.userService.findOne({
      where: {
        id: token.id,
      },
    });

    if (!user || !user.refresh_token) {
      throw new NotFoundException('User or refresh token is not found');
    }

    const decodedRefresh = await this.jwtService.verifyAsync(user.refresh_token, {
      secret: this.configService.get('REFRESH_KEY'),
    });

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (decodedRefresh.exp > currentTimestamp) {
      const payload = { id: user.email, fullName: user.fullName };
      const newAccessToken = this.jwtService.signAsync(payload, {
        secret: this.configService.get('ACCESS_KEY'),
        expiresIn: 60 * 15,
      });

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });

      return newAccessToken;
    }
    else {
      return { message: "Your login session has expired, please log in again" };
    }
  }
}
