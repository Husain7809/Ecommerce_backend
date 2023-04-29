import { HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { ForgotPassword } from './dto/forgot-password.dto';
import { EmailService } from 'src/helpers/EmailService';
import { ResetPassword } from './dto/reset-password.dto';
import { jwtConstants } from './constants';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService
    ) { }


    // user register
    async createUser(userData: CreateUserDto): Promise<any> {
        try {
            const { first_name, last_name, email, password } = userData;

            // password convert hash code
            const salt = await bcrypt.genSalt();
            const hashPass = await bcrypt.hash(password, salt);

            const result = await this.usersService.create({ first_name, last_name, email, password: hashPass });
            result.password = undefined;
            return {
                result
            };
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    // login method
    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (!user) {
            throw new HttpException("Invalid your credentials", HttpStatus.UNAUTHORIZED);
        }
        const isMatchPass = await bcrypt.compare(pass, user.password);

        if (user && isMatchPass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any): Promise<any> {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            token: await this.jwtService.sign(payload)
        };
    }


    async logout(): Promise<object> {
        return {
            message: "logout successFully."
        }
    }


    // forgot password
    async sendForgotPasswordLink(email: ForgotPassword, req): Promise<object> {
        const user = await this.usersService.findOne(email.email);
        if (!user) {
            throw new UnauthorizedException("Invalid Email Address")
        }
        const userEmailId = user.email;

        const token = jwt.sign({ user: user.id, email: userEmailId }, jwtConstants.secret);
        const expireTime = new Date(Date.now() + 15 * 60 * 1000);

        await this.usersService.setTokenAndDate(email, token, expireTime);  //save on db

        const resetPasswordLink = `${req.protocol}://${req.get("host")}/auth/password/reset/${token}`;

        const res = await EmailService.sendEmail(userEmailId, "Reset Password link", resetPasswordLink);

        if (!res.response) {
            return {
                msg: "Reset password link not send"
            };
        }

        return {
            message: `Reset password link send on your email address.`
        }
    }

    // reset password
    async resetPassword(token: string, userPassword: ResetPassword): Promise<any> {

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { email: string };

            const user = await this.usersService.findOne(decodedToken.email);

            const { password_expire_time, password_recovery_token } = user;
            const { password, confirm_password } = userPassword;

            const time = new Date(Date.now());

            if (token == password_recovery_token && password_expire_time >= time) {
                if (password === confirm_password) {
                    const genSalt = await bcrypt.genSalt();
                    const hashPass = await bcrypt.hash(password, genSalt);
                    const result = await this.usersService.userPasswordUpdate(decodedToken.email, hashPass);
                    if (result) {
                        await this.usersService.setTokenAndDate(decodedToken.email, null, null);
                        return {
                            msg: "Your password has been updated."
                        }
                    }
                }
            }
            return {
                msg: "Your reset password link has expired"
            }

        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }

    }


}
