import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({passthrough: true}) res: Response  
  ) {
    return this.authService.login(loginAuthDto, res);
  }
  
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response
  ){
    return this.authService.logout(req,res);
  }

  @Post('send-otp')
  sendOTP(@Body('email') email: string) {
    return this.authService.sendOTP(email);
  }

  @UseGuards(AuthGuard)
  @Post('refresh-token')
  refreshToken(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response
  ){
    return this.authService.refreshToken(req,res);
  }

}
