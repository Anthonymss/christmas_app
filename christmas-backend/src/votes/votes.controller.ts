import { Controller, Post, Body, UseGuards, Req, Get, Query, Param } from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) { }

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  vote(
    @Req() req,
    @Param('postId') postId: string,
    @Body('type') type: string
  ) {
    return this.votesService.vote(req.user.userId, +postId, type);
  }

  @Get('ranking')
  ranking(@Query('category') category: string) {
    return this.votesService.ranking(category);
  }
}
