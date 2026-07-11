
import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "../../../infrastructure/database/prisma/prisma.service";

@Injectable()
export class UserRepository {

    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data
        });
    }

    async findByPhone(phone: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                phone
            }
        });
    }

}