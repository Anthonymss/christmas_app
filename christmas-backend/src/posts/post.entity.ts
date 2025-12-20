import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Vote } from '../votes/vote.entity';
import { PostComment } from './post-comment.entity'; // Renamed to clearly indicate it belongs to Post

export enum PostCategory {
    CONCURSO = 'CONCURSO',
    NAVIDAD_FEA = 'NAVIDAD_FEA',
    VILLANCICOS = 'VILLANCICOS',
}

export enum PostType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
}

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, { eager: true })
    user: User;

    @Column({ type: 'varchar', length: 20 })
    category: PostCategory;

    @Column({ type: 'varchar', length: 20, default: 'IMAGE' })
    type: PostType;

    @Column()
    url: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: 0 })
    votesCount: number;

    @OneToMany(() => Vote, (vote) => vote.post)
    votes: Vote[];

    @OneToMany(() => PostComment, (comment) => comment.post)
    comments: PostComment[];

    @CreateDateColumn()
    createdAt: Date;
}
