import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from './post.entity';

@Entity('post_comments')
export class PostComment {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, { eager: true })
    user: User;

    @ManyToOne(() => Post, (post) => post.comments)
    post: Post;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}
