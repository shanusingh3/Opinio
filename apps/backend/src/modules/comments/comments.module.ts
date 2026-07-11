import { Module } from '@nestjs/common';
import { CommentsController } from './controllers/comments.controller';
import { CommentsService } from './services/comments.service';
import { CommentRepository } from './repositories/comment.repository';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository],
  exports: [CommentsService, CommentRepository],
})
export class CommentsModule {}
