import { Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { RouletteService } from './roulette.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('roulette')
export class RouletteController {
  constructor(private readonly rouletteService: RouletteService) {}

  @UseGuards(JwtAuthGuard)
  @Post('spin')
  spin(@Req() req) {
    return this.rouletteService.spin(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  myResult(@Req() req) {
    return this.rouletteService.myResult(req.user.userId);
  }
}
