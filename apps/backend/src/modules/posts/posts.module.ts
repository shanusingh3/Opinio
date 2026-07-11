import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';
import { PostRepository } from './repositories/post.repository';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostRepository],
  exports: [PostsService, PostRepository],
})
export class PostsModule {}
