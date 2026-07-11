import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { PostRepository } from '../../posts/repositories/post.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async create(authorId: string, dto: CreateCommentDto) {
    const post = await this.postRepository.findById(dto.postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (dto.parentId) {
      const parent = await this.commentRepository.findById(dto.parentId);
      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const comment = await this.commentRepository.create({
      content: dto.content,
      post: { connect: { id: dto.postId } },
      author: { connect: { id: authorId } },
      ...(dto.parentId && { parent: { connect: { id: dto.parentId } } }),
    });

    await this.postRepository.incrementCommentCount(dto.postId);

    return comment;
  }

  async findById(id: string) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async findByPostId(postId: string, skip = 0, take = 20) {
    return this.commentRepository.findByPostId(postId, skip, take);
  }

  async findReplies(parentId: string, skip = 0, take = 20) {
    return this.commentRepository.findReplies(parentId, skip, take);
  }

  async update(id: string, userId: string, dto: UpdateCommentDto) {
    const comment = await this.findById(id);

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.commentRepository.update(id, { content: dto.content });
  }

  async delete(id: string, userId: string) {
    const comment = await this.findById(id);

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.postRepository.decrementCommentCount(comment.postId);

    return this.commentRepository.delete(id);
  }
}
