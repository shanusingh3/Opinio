import { Injectable } from '@nestjs/common';
import { Prisma, Post, PostType } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
      include: {
        author: true,
        poll: {
          include: {
            options: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        poll: {
          include: {
            options: {
              orderBy: { order: 'asc' },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy: orderBy ?? { createdAt: 'desc' },
      include: {
        author: true,
        poll: {
          include: {
            options: {
              orderBy: { order: 'asc' },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async findByAuthorId(authorId: string, skip = 0, take = 20): Promise<Post[]> {
    return this.findMany({
      where: { authorId },
      skip,
      take,
    });
  }

  async update(id: string, data: Prisma.PostUpdateInput): Promise<Post> {
    return this.prisma.post.update({
      where: { id },
      data,
      include: {
        author: true,
        poll: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Post> {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  async incrementLikeCount(id: string): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    });
  }

  async decrementLikeCount(id: string): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { likeCount: { decrement: 1 } },
    });
  }

  async incrementCommentCount(id: string): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { commentCount: { increment: 1 } },
    });
  }

  async decrementCommentCount(id: string): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { commentCount: { decrement: 1 } },
    });
  }
}
