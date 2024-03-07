import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateUserRoleDto {
    @ApiProperty()
    @IsNotEmpty()
    UserId: string;

    @ApiProperty()
    @IsNotEmpty()
    RoleId: string;
}