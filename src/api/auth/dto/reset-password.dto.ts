import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class ResetPassword {
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(12)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,15}$/gm, {
        message:
            'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.',
    })
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(12)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,15}$/gm, {
        message:
            'Your confirm password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.',
    })
    confirm_password: string;
}