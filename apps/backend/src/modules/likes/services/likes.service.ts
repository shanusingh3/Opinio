import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { LikeRepository } from '../repositories/like.repository';
import { CreateLikeDto } from '../dto/create-like.dto';
import { PostRepository } from '../../posts/repositories/post.repository';
import { CommentRepository } from '../../comments/repositories/comment.repository';

@Injectable()
export class LikesService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async likePost(userId: string, postId: string) {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findByUserAndPost(userId, postId);
    if (existingLike) {
      throw new ConflictException('You have already liked this post');
    }

    const like = await this.likeRepository.create({
      user: { connect: { id: userId } },
      post: { connect: { id: postId } },
    });

    await this.postRepository.incrementLikeCount(postId);

    return like;
  }

  async unlikePost(userId: string, postId: string) {
    const like = await this.likeRepository.findByUserAndPost(userId, postId);
    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likeRepository.delete(like.id);
    await this.postRepository.decrementLikeCount(postId);

    return { message: 'Post unliked' };
  }

  async likeComment(userId: string, commentId: string) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existingLike = await this.likeRepository.findByUserAndComment(userId, commentId);
    if (existingLike) {
      throw new ConflictException('You have already liked this comment');
    }

    const like = await this.likeRepository.create({
      user: { connect: { id: userId } },
      comment: { connect: { id: commentId } },
    });

    await this.commentRepository.incrementLikeCount(commentId);

    return like;
  }

  async unlikeComment(userId: string, commentId: string) {
    const like = await this.likeRepository.findByUserAndComment(userId, commentId);
    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likeRepository.delete(like.id);
    await this.commentRepository.decrementLikeCount(commentId);

    return { message: 'Comment unliked' };
  }

  async toggleLike(userId: string, dto: CreateLikeDto) {
    if (!dto.postId && !dto.commentId) {
      throw new BadRequestException('Either postId or commentId is required');
    }

    if (dto.postId) {
      const existingLike = await this.likeRepository.findByUserAndPost(userId, dto.postId);
      if (existingLike) {
        return this.unlikePost(userId, dto.postId);
      }
      return this.likePost(userId, dto.postId);
    }

    if (dto.commentId) {
      const existingLike = await this.likeRepository.findByUserAndComment(userId, dto.commentId);
      if (existingLike) {
        return this.unlikeComment(userId, dto.commentId);
      }
      return this.likeComment(userId, dto.commentId);
    }
  }
}
