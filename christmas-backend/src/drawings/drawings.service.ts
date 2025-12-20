import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drawing } from './drawing.entity';
import { User } from '../users/user.entity';
import { CreateDrawingDto } from './dto/create-drawing.dto';

@Injectable()
export class DrawingsService {
  constructor(
    @InjectRepository(Drawing)
    private readonly drawingsRepo: Repository<Drawing>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) { }

  async create(userId: number, dto: CreateDrawingDto, imageUrl: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Usuario inválido');

    const exists = await this.drawingsRepo.findOne({
      where: { user: { id: userId }, category: dto.category },
    });
    if (exists) {
      throw new BadRequestException('Ya subiste un dibujo en esta categoría');
    }

    const drawing = this.drawingsRepo.create({
      user,
      category: dto.category,
      imageUrl,
    });
    const result = await this.drawingsRepo.save(drawing);
    return {
      id: result.id,
      category: result.category,
      userId: result.user.id,
      userName: result.user.username,
      imageUrl: result.imageUrl,
      createdAt: result.createdAt,
    };
  }

  async list(category?: 'CONCURSO' | 'NAVIDAD_FEA') {
    const where = category ? { category } : {};
    const drawings = await this.drawingsRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
    return drawings.map((drawing) => ({
      id: drawing.id,
      category: drawing.category,
      userId: drawing.user.id,
      userName: drawing.user.username,
      imageUrl: drawing.imageUrl,
      votesCount: drawing.votesCount,
      createdAt: drawing.createdAt,
    }));
  }
}
