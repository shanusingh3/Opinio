import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LikesService } from '../services/likes.service';
import { CreateLikeDto } from '../dto/create-like.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle')
  toggle(@Request() req, @Body() dto: CreateLikeDto) {
    return this.likesService.toggleLike(req.user.sub, dto);
  }

  @Post('post/:postId')
  likePost(@Request() req, @Param('postId') postId: string) {
    return this.likesService.likePost(req.user.sub, postId);
  }

  @Delete('post/:postId')
  unlikePost(@Request() req, @Param('postId') postId: string) {
    return this.likesService.unlikePost(req.user.sub, postId);
  }

  @Post('comment/:commentId')
  likeComment(@Request() req, @Param('commentId') commentId: string) {
    return this.likesService.likeComment(req.user.sub, commentId);
  }

  @Delete('comment/:commentId')
  unlikeComment(@Request() req, @Param('commentId') commentId: string) {
    return this.likesService.unlikeComment(req.user.sub, commentId);
  }
}
