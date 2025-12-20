import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';
import { EventsService } from '../events/events.service';

@Injectable()
export class VotesService {
    constructor(
        @InjectRepository(Vote)
        private readonly votesRepo: Repository<Vote>,
        @InjectRepository(Post)
        private readonly postsRepo: Repository<Post>,
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
        private readonly events: EventsService,
    ) { }

    private checkTimeLock(category: string) {
        if (category === 'VILLANCICOS') {
            const start = new Date('2025-12-24T20:00:00-05:00');
            if (new Date() < start) {
                throw new ForbiddenException('Votación cerrada hasta el 24 de Diciembre 8:00 PM');
            }
        }
    }

    async vote(userId: number, postId: number, type: string = 'HEART') {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        const post = await this.postsRepo.findOne({ where: { id: postId } });

        if (!user || !post) {
            throw new NotFoundException('Datos inválidos');
        }

        // LOCK: VILLANCICOS only allowed after Dec 24 8PM
        this.checkTimeLock(post.category);

        const existingVote = await this.votesRepo.findOne({
            where: { user: { id: userId }, post: { id: postId } }
        });

        if (existingVote) {
            if (existingVote.type === type) {
                // Toggle OFF
                await this.votesRepo.remove(existingVote);
                await this.postsRepo.decrement({ id: postId }, 'votesCount', 1);
                this.events.emit({ type: 'ranking_update', category: post.category });
                return { message: 'Reacción eliminada' };
            }
            // Change reaction type
            existingVote.type = type;
            await this.votesRepo.save(existingVote);
            this.events.emit({ type: 'ranking_update', category: post.category });
            return { message: 'Reacción actualizada' };
        }

        const vote = this.votesRepo.create({ user, post, type });
        await this.votesRepo.save(vote);

        await this.postsRepo.increment({ id: postId }, 'votesCount', 1);
        this.events.emit({ type: 'ranking_update', category: post.category });

        return { message: 'Voto registrado' };
    }

    async ranking(category: string) {
        // Return unified ranking structure
        const posts = await this.postsRepo.find({
            where: { category: category as any },
            order: { votesCount: 'DESC', createdAt: 'ASC' },
            relations: ['user']
        });

        return posts.map(p => ({
            drawingId: p.id, // Keeping 'drawingId' alias for frontend compatibility if needed, or update frontend
            postId: p.id,
            imageUrl: p.url,
            votes: p.votesCount,
            username: p.user.username
        }));
    }
}
