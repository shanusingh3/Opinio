import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { User } from 'generated/prisma';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UserRepository) { }

    async findByPhone(phone: string) {
        return this.userRepository.findByPhone(phone);
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findById(id);
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

