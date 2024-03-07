import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
    
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(5, undefined, {message: "At least 5 characters to continue"})
    password: string;


    @IsNotEmpty()
    fullName: string;

}
