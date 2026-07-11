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
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(req.user.sub, dto);
  }

  @Get('post/:postId')
  findByPost(
    @Param('postId') postId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.commentsService.findByPostId(
      postId,
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 20,
    );
  }

  @Get(':id/replies')
  findReplies(
    @Param('id') id: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.commentsService.findReplies(
      id,
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 20,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Request() req, @Param('id') id: string) {
    return this.commentsService.delete(id, req.user.sub);
  }
}
