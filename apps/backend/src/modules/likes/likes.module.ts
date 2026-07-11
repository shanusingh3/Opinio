import { Module } from '@nestjs/common';
import { LikesController } from './controllers/likes.controller';
import { LikesService } from './services/likes.service';
import { LikeRepository } from './repositories/like.repository';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [PostsModule, CommentsModule],
  controllers: [LikesController],
  providers: [LikesService, LikeRepository],
  exports: [LikesService],
})
export class LikesModule {}
