import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    BadGatewayException,
    CallHandler,
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
    InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError(error => {
                if (error instanceof BadRequestException) {
                    return throwError(() => new BadRequestException('Bad request. Please check your input data.'));
                } else if (error instanceof NotFoundException) {
                    return throwError(() => new NotFoundException('Resource not found.'));
                } else if (error instanceof UnauthorizedException) {
                    return throwError(() => new UnauthorizedException('Unauthorized access.'));
                } else {
                    return throwError(() => new InternalServerErrorException('Internal server error.'));
                }
            }),
        );
    }
}
