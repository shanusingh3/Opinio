import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() dto: CreatePostDto) {
    return this.postsService.create(req.user.sub, dto);
  }

  @Get('feed')
  getFeed(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.postsService.findFeed(
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 20,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.postsService.findByAuthorId(
      userId,
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 20,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Request() req, @Param('id') id: string) {
    return this.postsService.delete(id, req.user.sub);
  }

  @Get(':id/liked')
  @UseGuards(JwtAuthGuard)
  checkLiked(@Request() req, @Param('id') id: string) {
    return this.postsService.checkUserLiked(id, req.user.sub);
  }

  @Get(':id/voted')
  @UseGuards(JwtAuthGuard)
  checkVoted(@Request() req, @Param('id') id: string) {
    return this.postsService.checkUserVoted(id, req.user.sub);
  }
}
