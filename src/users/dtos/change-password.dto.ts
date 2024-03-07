import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length} from "class-validator";

export class ChangePasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsString()
    @Length(5, undefined, {message: "At least 5 characters to continue"})
    newPassword: string;
}