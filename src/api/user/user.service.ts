import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
        const result = await this.userRepository.save(userData);
        return result;
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

    // reset password token and expire time save
    async setTokenAndDate(email, token: string, expireTime: any) {
        const user = new User();
        user.password_recovery_token = token;
        user.password_expire_time = expireTime;

        if (token == null && expireTime === null) {
            await this.userRepository.createQueryBuilder().update(User).set({ password_recovery_token: token, password_expire_time: expireTime }).where({ email }).execute();
        } else {
            await this.userRepository.update(email, user);
        }
    }

    // update password user
    async userPasswordUpdate(email, password): Promise<boolean> {
        const user = new User();
        user.password = password;
        const result = await this.userRepository.createQueryBuilder().update(User).set({ password }).where({ email }).execute();
        if (!result) {
            return false;
        }
        return true;
    }



}
