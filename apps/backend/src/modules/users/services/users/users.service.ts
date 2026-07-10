import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UserRepository) { }

    async findByPhone(phone: string) {
        return this.userRepository.findByPhone(phone);
    }

    async findOrCreate(phone: string) {
        const existingUser = await this.userRepository.findByPhone(phone);

        if (existingUser) {
            return existingUser;
        }

        return this.userRepository.create({
            phone,
        });
    }
}

