import { Injectable } from '@nestjs/common';
import { Prisma, Comment } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CommentCreateInput): Promise<Comment> {
    return this.prisma.comment.create({
      data,
      include: {
        author: true,
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: true,
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });
  }

  async findByPostId(postId: string, skip = 0, take = 20): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });
  }

  async findReplies(parentId: string, skip = 0, take = 20): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { parentId },
      skip,
      take,
      orderBy: { createdAt: 'asc' },
      include: {
        author: true,
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.CommentUpdateInput): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    });
  }

  async delete(id: string): Promise<Comment> {
    return this.prisma.comment.delete({
      where: { id },
    });
  }

  async incrementLikeCount(id: string): Promise<void> {
    await this.prisma.comment.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    });
  }

  async decrementLikeCount(id: string): Promise<void> {
    await this.prisma.comment.update({
      where: { id },
      data: { likeCount: { decrement: 1 } },
    });
  }
}
