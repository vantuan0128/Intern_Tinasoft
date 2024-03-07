import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private userService: Repository<User>,

        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const token = this.extractTokenFromCookies(req);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const decodedToken = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get('ACCESS_KEY'),
                }
            );

            const userExisted = await this.userService.findOne({
                where: {
                    id: decodedToken.id,
                },
            });

            if(!userExisted) throw new NotFoundException('User not exist');

            req['user'] = userExisted;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromCookies(req: Request): string | undefined {
        const token = req.cookies['access_token'];
        if(!token) return undefined;
        else return token;
    }
}