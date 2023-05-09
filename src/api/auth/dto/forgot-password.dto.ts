import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPassword {
    @IsEmail()
    @ApiProperty({ example: "xyz@gmail.com" })
    email: string
}