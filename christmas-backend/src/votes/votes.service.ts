import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { Drawing } from '../drawings/drawing.entity';
import { User } from '../users/user.entity';
import { EventsService } from '../events/events.service';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly votesRepo: Repository<Vote>,
    @InjectRepository(Drawing)
    private readonly drawingsRepo: Repository<Drawing>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly events: EventsService,
  ) { }

  async vote(userId: number, drawingId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    const drawing = await this.drawingsRepo.findOne({ where: { id: drawingId } });

    if (!user || !drawing) {
      throw new BadRequestException('Datos inválidos');
    }

    const vote = this.votesRepo.create({ user, drawing });
    try {
      await this.votesRepo.save(vote);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya votaste por este dibujo');
      }
      throw error;
    }

    // Increment counter
    await this.drawingsRepo.increment({ id: drawingId }, 'votesCount', 1);

    // Emitir actualización de ranking
    this.events.emit({ type: 'ranking_update' });

    return { message: 'Voto registrado' };
  }

  async ranking(category?: 'CONCURSO' | 'NAVIDAD_FEA') {
    const qb = this.drawingsRepo.createQueryBuilder('d')
      .select(['d.id', 'd.imageUrl', 'd.votesCount', 'u.username'])
      .innerJoin('d.user', 'u')
      .orderBy('d.votesCount', 'DESC');

    if (category) {
      qb.where('d.category = :category', { category });
    }

    const results = await qb.getMany();
    return results.map(d => ({
      drawingId: d.id,
      imageUrl: d.imageUrl,
      votes: d.votesCount,
      username: d.user.username
    }));
  }
}
