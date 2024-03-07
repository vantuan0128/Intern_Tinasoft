import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { POSITIONS_KEY } from "./decorators/positions.decorator";
import { Position } from "src/enums/position.enum";

@Injectable()
export class PositionsGuard implements CanActivate {
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const requiredPositions = this.reflector.getAllAndOverride<Position[]>(POSITIONS_KEY,[
            context.getHandler(),
            context.getClass(),
        ]);

        if(!requiredPositions) return true;

        const { user } = context.switchToHttp().getRequest();
        return user.positions?.some(position => requiredPositions.includes(position.name));
    }
}