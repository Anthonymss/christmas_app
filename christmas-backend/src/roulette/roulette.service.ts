import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Roulette } from './roulette.entity';
import { Prize } from './prize.entity';
import { User } from '../users/user.entity';

@Injectable()
export class RouletteService {
  constructor(
    @InjectRepository(Roulette)
    private readonly rouletteRepo: Repository<Roulette>,
    @InjectRepository(Prize)
    private readonly prizeRepo: Repository<Prize>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) { }

  async seedDefaults() {
    const count = await this.prizeRepo.count();
    if (count > 0) {
      return { message: 'Stock already initialized', success: false };
    }

    console.log('Seeding initial prizes...');
    const seeds = [
      { name: 'S/10.0', stock: 2 },
      { name: 'Minipanetón', stock: 5 },
      { name: 'Panetón', stock: 1 },
      { name: 'Minipanetón', stock: 5 },
      { name: 'Carro juguete', stock: 2 },
      { name: 'Rompecabezas', stock: 1 },
      { name: 'Foto con el Sr. Conejo', stock: 1 },
    ];
    await this.prizeRepo.save(seeds);
    return { message: 'Stock initialized successfully', success: true };
  }

  private isDay(): boolean {
    const dateStr = this.configService.get('VOTING_OPEN_DATE') || '2025-12-24T20:00:00-05:00';
    const targetDate = new Date(dateStr);
    const now = new Date();
    return now >= targetDate;
  }

  async spin(userId: number) {
    if (!this.isDay()) {
      const dateStr = this.configService.get('VOTING_OPEN_DATE') || '2025-12-24T20:00:00-05:00';
      const targetDate = new Date(dateStr);
      const msg = targetDate.toLocaleString('es-PE', { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' });
      throw new BadRequestException(`La ruleta estará disponible a partir del ${msg}`);
    }

    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Usuario inválido');

    const already = await this.rouletteRepo.findOne({
      where: { user: { id: userId } },
    });
    if (already) {
      throw new BadRequestException('Ya has participado');
    }

    const availablePrizes = await this.prizeRepo.createQueryBuilder('prize')
      .where('prize.stock > 0')
      .getMany();

    if (availablePrizes.length === 0) {
      throw new BadRequestException('Ya no quedan premios disponibles 😔');
    }

    const randomIndex = Math.floor(Math.random() * availablePrizes.length);
    const selectedPrize = availablePrizes[randomIndex];

    selectedPrize.stock -= 1;
    await this.prizeRepo.save(selectedPrize);

    const entry = this.rouletteRepo.create({
      user,
      result: selectedPrize.name,
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
  async prizes() {
    return this.prizeRepo.find({ order: { stock: 'DESC' } });
  }
}
