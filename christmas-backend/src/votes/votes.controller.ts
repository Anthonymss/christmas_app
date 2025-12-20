import { Controller, Post, Body, UseGuards, Req, Get, Query } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VoteDto } from './dto/vote.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  vote(@Req() req, @Body() dto: VoteDto) {
    return this.votesService.vote(req.user.userId, dto.drawingId);
  }

  @Get('ranking')
  ranking(@Query('category') category?: 'CONCURSO' | 'NAVIDAD_FEA') {
    return this.votesService.ranking(category);
  }
}
