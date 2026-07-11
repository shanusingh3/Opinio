import { Module } from '@nestjs/common';
import { VotesController } from './controllers/votes.controller';
import { VotesService } from './services/votes.service';
import { VoteRepository } from './repositories/vote.repository';

@Module({
  controllers: [VotesController],
  providers: [VotesService, VoteRepository],
  exports: [VotesService],
})
export class VotesModule {}
