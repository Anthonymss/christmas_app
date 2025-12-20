import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouletteService } from './roulette.service';
import { RouletteController } from './roulette.controller';
import { Roulette } from './roulette.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roulette, User])],
  providers: [RouletteService],
  controllers: [RouletteController],
})
export class RouletteModule {}
