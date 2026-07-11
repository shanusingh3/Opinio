import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { VoteRepository } from '../repositories/vote.repository';
import { CreateVoteDto } from '../dto/create-vote.dto';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';

@Injectable()
export class VotesService {
  constructor(
    private readonly voteRepository: VoteRepository,
    private readonly prisma: PrismaService,
  ) {}

  async vote(userId: string, dto: CreateVoteDto) {
    const pollOption = await this.prisma.pollOption.findUnique({
      where: { id: dto.pollOptionId },
      include: { poll: true },
    });

    if (!pollOption) {
      throw new BadRequestException('Poll option not found');
    }

    if (pollOption.poll.endsAt && new Date() > pollOption.poll.endsAt) {
      throw new BadRequestException('Poll has ended');
    }

    const existingVote = await this.voteRepository.findByUserAndPoll(
      userId,
      pollOption.pollId,
    );

    if (existingVote) {
      throw new ConflictException('You have already voted on this poll');
    }

    const vote = await this.prisma.$transaction(async (tx) => {
      const newVote = await tx.vote.create({
        data: {
          user: { connect: { id: userId } },
          pollOption: { connect: { id: dto.pollOptionId } },
        },
        include: {
          pollOption: true,
        },
      });

      await tx.pollOption.update({
        where: { id: dto.pollOptionId },
        data: { voteCount: { increment: 1 } },
      });

      await tx.poll.update({
        where: { id: pollOption.pollId },
        data: { totalVotes: { increment: 1 } },
      });

      return newVote;
    });

    return vote;
  }

  async changeVote(userId: string, dto: CreateVoteDto) {
    const pollOption = await this.prisma.pollOption.findUnique({
      where: { id: dto.pollOptionId },
      include: { poll: true },
    });

    if (!pollOption) {
      throw new BadRequestException('Poll option not found');
    }

    if (pollOption.poll.endsAt && new Date() > pollOption.poll.endsAt) {
      throw new BadRequestException('Poll has ended');
    }

    const existingVote = await this.voteRepository.findByUserAndPoll(
      userId,
      pollOption.pollId,
    );

    if (!existingVote) {
      return this.vote(userId, dto);
    }

    if (existingVote.pollOptionId === dto.pollOptionId) {
      return existingVote;
    }

    const vote = await this.prisma.$transaction(async (tx) => {
      await tx.pollOption.update({
        where: { id: existingVote.pollOptionId },
        data: { voteCount: { decrement: 1 } },
      });

      await tx.vote.delete({
        where: { id: existingVote.id },
      });

      const newVote = await tx.vote.create({
        data: {
          user: { connect: { id: userId } },
          pollOption: { connect: { id: dto.pollOptionId } },
        },
        include: {
          pollOption: true,
        },
      });

      await tx.pollOption.update({
        where: { id: dto.pollOptionId },
        data: { voteCount: { increment: 1 } },
      });

      return newVote;
    });

    return vote;
  }

  async unvote(userId: string, pollOptionId: string) {
    const vote = await this.voteRepository.findByUserAndOption(userId, pollOptionId);

    if (!vote) {
      throw new BadRequestException('Vote not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.vote.delete({
        where: { id: vote.id },
      });

      const pollOption = await tx.pollOption.update({
        where: { id: pollOptionId },
        data: { voteCount: { decrement: 1 } },
      });

      await tx.poll.update({
        where: { id: pollOption.pollId },
        data: { totalVotes: { decrement: 1 } },
      });
    });

    return { message: 'Vote removed' };
  }
}
