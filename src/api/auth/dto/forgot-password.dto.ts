import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPassword {
    @IsEmail()
    email: string
}