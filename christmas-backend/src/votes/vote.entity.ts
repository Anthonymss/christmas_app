import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';

@Entity('votes')
@Unique(['user', 'post'])
export class Vote {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Post)
    post: Post;

    @Column({
        type: 'enum',
        enum: ['HEART', 'LAUGH', 'WOW', 'CHRISTMAS'],
        default: 'HEART',
    })
    type: string;

    @CreateDateColumn()
    createdAt: Date;
}
