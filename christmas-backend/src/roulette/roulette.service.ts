import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roulette } from './roulette.entity';
import { User } from '../users/user.entity';

@Injectable()
export class RouletteService {
  constructor(
    @InjectRepository(Roulette)
    private readonly rouletteRepo: Repository<Roulette>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) { }

  private isDay(): boolean {
    const now = new Date();
    const peruTime = new Date(now.getTime() - 5 * 60 * 60 * 1000);
    return peruTime.getDate() === Number(process.env.DAY) && peruTime.getMonth() === 11;
  }

  private spinResult(): string {
    const results = [
      '🎁 Premio real',
      '😂 Reto familiar',
      '🎄 Premio simbólico',
      '❄️ Inténtalo el próximo año',
      '🎉 Premio real'
    ];
    return results[Math.floor(Math.random() * results.length)];
  }

  async spin(userId: number) {
    if (!this.isDay()) {
      throw new BadRequestException('La ruleta solo está disponible el ' + process.env.DAY + ' de diciembre');
    }

    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Usuario inválido');

    const already = await this.rouletteRepo.findOne({
      where: { user: { id: userId } },
    });
    if (already) {
      throw new BadRequestException('Ya has participado');
    }

    const result = this.spinResult();

    const entry = this.rouletteRepo.create({
      user,
      result,
    });
    await this.rouletteRepo.save(entry);
    return {
      id_entry: entry.id,
      username: entry.user.username,
      result: entry.result
    };
  }

  async myResult(userId: number) {
    const entry = await this.rouletteRepo.findOne({
      where: { user: { id: userId } },
      join: {
        alias: 'roulette',
        leftJoinAndSelect: {
          user: 'roulette.user',
        },
      },
    });
    if (!entry) throw new BadRequestException('No has participado');
    return {
      id_entry: entry.id,
      username: entry.user.username,
      result: entry.result
    };
  }
}
