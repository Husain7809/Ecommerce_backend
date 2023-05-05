import { Controller, Post, Body, Patch, Param, UseGuards, Request, Get, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Roles } from './roles.decorator';
import { Role } from 'src/helpers/role.enum';
import { RolesGuard } from './guards/roles.guard';
import { ForgotPassword } from './dto/forgot-password.dto';
import { ResetPassword } from './dto/reset-password.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('/register')
  async userRegister(@Body() userData: CreateUserDto): Promise<User> {
    const { email, first_name, last_name, password } = userData;
    return await this.authService.createUser({ email, first_name, last_name, password });
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Get('/profile')
  // async getProfile(@Request() req) {
  //   return req.user;
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get('/logout')
  logoutUser(@Req() req) {
    return this.authService.logout();
  }

  @Post('/password/forgot')
  async sendForgotPasswordLink(@Body() email: ForgotPassword, @Req() req) {
    return this.authService.sendForgotPasswordLink(email, req);
  }

  @Post('/password/reset/:token')
  async resetPassword(@Param('token') token: string, @Body() userPassword: ResetPassword) {
    return await this.authService.resetPassword(token, userPassword);
  }

}
