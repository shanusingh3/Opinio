import { Injectable } from '@nestjs/common';
import { Prisma, Like } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';

@Injectable()
export class LikeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.LikeCreateInput): Promise<Like> {
    return this.prisma.like.create({
      data,
    });
  }

  async findByUserAndPost(userId: string, postId: string): Promise<Like | null> {
    return this.prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });
  }

  async findByUserAndComment(userId: string, commentId: string): Promise<Like | null> {
    return this.prisma.like.findUnique({
      where: {
        userId_commentId: { userId, commentId },
      },
    });
  }

  async delete(id: string): Promise<Like> {
    return this.prisma.like.delete({
      where: { id },
    });
  }

  async deleteByUserAndPost(userId: string, postId: string): Promise<Like> {
    return this.prisma.like.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });
  }

  async deleteByUserAndComment(userId: string, commentId: string): Promise<Like> {
    return this.prisma.like.delete({
      where: {
        userId_commentId: { userId, commentId },
      },
    });
  }
}
