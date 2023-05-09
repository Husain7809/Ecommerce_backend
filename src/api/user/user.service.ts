import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    // create user
    async create(userData: CreateUserDto): Promise<User> {
        try {
            const user = new User();
            user.first_name = userData.first_name;
            user.last_name = userData.last_name;
            user.email = userData.email;
            user.password = userData.password;

            const result = await this.userRepository.save(user);
            return result;
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    // find user by email id
    async findOne(email: string): Promise<User | any> {
        try {
            const result = await this.userRepository.findOne({ where: { email } });
            return result;
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    // check email id is exits or not
    async isEmailAlreadyExists(email: string): Promise<number> {
        try {
            const count = await this.userRepository.createQueryBuilder('user').where('user.email=:email', { email }).getCount();
            return count;
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }


    // reset password token and expire time save
    async setTokenAndDate(email, token: string, expireTime: any) {
        try {
            const user = new User();
            user.password_recovery_token = token;
            user.password_expire_time = expireTime;

            if (token == null && expireTime === null) {
                await this.userRepository.createQueryBuilder().update(User).set({ password_recovery_token: token, password_expire_time: expireTime }).where({ email }).execute();
            }
            await this.userRepository.update(email, user);
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }

    // update password user
    async userPasswordUpdate(email: string, password: string): Promise<boolean> {
        try {
            const user = new User();
            user.password = password;
            const result = await this.userRepository.createQueryBuilder().update(User).set({ password }).where({ email }).execute();
            if (!result) {
                return false;
            }
            return true;
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }
}
