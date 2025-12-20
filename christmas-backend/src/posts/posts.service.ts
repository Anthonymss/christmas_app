import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostCategory, PostType } from './post.entity';
import { PostComment } from './post-comment.entity';
import { User } from '../users/user.entity';
import { EventsService } from '../events/events.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepo: Repository<Post>,
        @InjectRepository(PostComment)
        private readonly commentsRepo: Repository<PostComment>,
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
        private readonly events: EventsService,
    ) { }

    async create(userId: number, category: PostCategory, type: PostType, url: string, description?: string) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) throw new BadRequestException('Usuario inválido');

        const exists = await this.postsRepo.findOne({
            where: { user: { id: userId }, category },
        });
        if (exists) {
            throw new BadRequestException('Ya has participado en esta categoría. Puedes reemplazar tu participación desde tu perfil.');
        }

        const post = this.postsRepo.create({
            user,
            category,
            type,
            url,
            description,
        });

        const savedPost = await this.postsRepo.save(post);
        this.events.emit({ type: 'ranking_update', category });
        return savedPost;
    }

    async replacePost(userId: number, postId: number, url: string, description?: string) {
        const post = await this.postsRepo.findOne({ where: { id: postId }, relations: ['user'] });
        if (!post) throw new NotFoundException('Post no encontrado');
        if (post.user.id !== userId) throw new ForbiddenException('No tienes permiso para editar este post');

        post.url = url;
        if (description !== undefined) post.description = description;

        const savedPost = await this.postsRepo.save(post);
        this.events.emit({ type: 'ranking_update', category: post.category });
        return savedPost;
    }

    async getMyPosts(userId: number) {
        const posts = await this.postsRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            relations: ['user', 'votes', 'votes.user', 'comments']
        });

        return posts.map(post => {
            const reactionsRaw = post.votes || [];
            const reacters = reactionsRaw.map(v => v.user?.username).filter(Boolean);

            const reactionsStats = reactionsRaw.reduce((acc, v) => {
                acc[v.type] = (acc[v.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            return {
                id: post.id,
                category: post.category,
                type: post.type,
                url: post.url,
                description: post.description,
                userId: post.user.id,
                username: post.user.username,
                votesCount: post.votesCount === null ? 0 : post.votesCount,
                createdAt: post.createdAt,
                reacters,
                reactionsStats,
                comments: []
            };
        });
    }
    async list(category: PostCategory) {
        const posts = await this.postsRepo.find({
            where: { category },
            order: { votesCount: 'DESC', createdAt: 'ASC' },
            relations: ['user', 'votes', 'votes.user', 'comments', 'comments.user']
        });

        return posts.map(post => {
            const reactionsRaw = post.votes || [];
            const reacters = reactionsRaw.map(v => v.user?.username).filter(Boolean);

            const reactionsStats = reactionsRaw.reduce((acc, v) => {
                acc[v.type] = (acc[v.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            return {
                id: post.id,
                category: post.category,
                type: post.type,
                url: post.url,
                description: post.description,
                userId: post.user.id,
                username: post.user.username,
                votesCount: post.votesCount === null ? 0 : post.votesCount,
                createdAt: post.createdAt,
                reacters,
                reactionsStats,
                comments: post.comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(c => ({
                    id: c.id,
                    content: c.content,
                    createdAt: c.createdAt,
                    user: { username: c.user.username }
                }))
            };
        });
    }

    async addComment(userId: number, postId: number, content: string) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        const post = await this.postsRepo.findOne({ where: { id: postId } });
        if (!user || !post) throw new NotFoundException('Post o usuario no encontrado');

        const comment = this.commentsRepo.create({ user, post, content });
        await this.commentsRepo.save(comment);

        this.events.emit({ type: 'ranking_update', category: post.category });
        return comment;
    }
}
