import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsModule } from '../uploads/uploads.module';
import { EventsModule } from '../events/events.module';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './post.entity';
import { PostComment } from './post-comment.entity';
import { User } from '../users/user.entity';
import { Vote } from '../votes/vote.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post, PostComment, User, Vote]), UploadsModule, EventsModule],
    providers: [PostsService],
    controllers: [PostsController],
    exports: [PostsService, TypeOrmModule]
})
export class PostsModule { }
