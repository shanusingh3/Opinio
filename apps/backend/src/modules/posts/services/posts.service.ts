import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostDto, PostType } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(authorId: string, dto: CreatePostDto) {
    const postData: any = {
      type: dto.type,
      content: dto.content,
      author: { connect: { id: authorId } },
    };

    if (dto.type === PostType.POLL && dto.pollOptions?.length) {
      postData.poll = {
        create: {
          endsAt: dto.pollEndsAt ? new Date(dto.pollEndsAt) : null,
          options: {
            create: dto.pollOptions.map((option, index) => ({
              text: option.text,
              order: index,
            })),
          },
        },
      };
    }

    return this.postRepository.create(postData);
  }

  async findById(id: string) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async findFeed(skip = 0, take = 20) {
    return this.postRepository.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAuthorId(authorId: string, skip = 0, take = 20) {
    return this.postRepository.findByAuthorId(authorId, skip, take);
  }

  async update(id: string, userId: string, dto: UpdatePostDto) {
    const post = await this.findById(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    return this.postRepository.update(id, dto);
  }

  async delete(id: string, userId: string) {
    const post = await this.findById(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return this.postRepository.delete(id);
  }

  async checkUserLiked(postId: string, userId: string): Promise<boolean> {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });
    return !!like;
  }

  async checkUserVoted(postId: string, userId: string): Promise<string | null> {
    const post = await this.postRepository.findById(postId) as any;
    if (!post?.poll) return null;

    const vote = await this.prisma.vote.findFirst({
      where: {
        userId,
        pollOption: {
          pollId: post.poll.id,
        },
      },
    });

    return vote?.pollOptionId ?? null;
  }
}
