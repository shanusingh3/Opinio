import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VotesService } from '../services/votes.service';
import { CreateVoteDto } from '../dto/create-vote.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('votes')
@UseGuards(JwtAuthGuard)
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  vote(@Request() req, @Body() dto: CreateVoteDto) {
    return this.votesService.vote(req.user.sub, dto);
  }

  @Post('change')
  changeVote(@Request() req, @Body() dto: CreateVoteDto) {
    return this.votesService.changeVote(req.user.sub, dto);
  }

  @Delete(':pollOptionId')
  unvote(@Request() req, @Param('pollOptionId') pollOptionId: string) {
    return this.votesService.unvote(req.user.sub, pollOptionId);
  }
}
