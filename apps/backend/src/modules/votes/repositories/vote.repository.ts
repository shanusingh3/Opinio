import { Injectable } from '@nestjs/common';
import { Prisma, Vote } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';

@Injectable()
export class VoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.VoteCreateInput): Promise<Vote> {
    return this.prisma.vote.create({
      data,
      include: {
        pollOption: true,
      },
    });
  }

  async findByUserAndPoll(userId: string, pollId: string): Promise<Vote | null> {
    return this.prisma.vote.findFirst({
      where: {
        userId,
        pollOption: {
          pollId,
        },
      },
      include: {
        pollOption: true,
      },
    });
  }

  async findByUserAndOption(userId: string, pollOptionId: string): Promise<Vote | null> {
    return this.prisma.vote.findUnique({
      where: {
        userId_pollOptionId: { userId, pollOptionId },
      },
    });
  }

  async delete(id: string): Promise<Vote> {
    return this.prisma.vote.delete({
      where: { id },
    });
  }

  async deleteByUserAndOption(userId: string, pollOptionId: string): Promise<Vote> {
    return this.prisma.vote.delete({
      where: {
        userId_pollOptionId: { userId, pollOptionId },
      },
    });
  }
}
