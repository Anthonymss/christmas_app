import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { Vote } from './vote.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Vote, Post, User]),
        EventsModule,
    ],
    providers: [VotesService],
    controllers: [VotesController],
})
export class VotesModule { }
