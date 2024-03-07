import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateUserPositionDto {
    @ApiProperty()
    @IsNotEmpty()
    UserId: string;

    @ApiProperty()
    @IsNotEmpty()
    PositionId: string;
}