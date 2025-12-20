import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Drawing } from '../drawings/drawing.entity';

@Entity('votes')
@Unique(['user', 'drawing'])
export class Vote {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Drawing)
  drawing: Drawing;

  @Column({ default: 1 })
  value: number;

  @CreateDateColumn()
  createdAt: Date;
}
