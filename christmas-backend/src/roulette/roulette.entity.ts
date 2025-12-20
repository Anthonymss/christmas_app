import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('roulette')
@Unique(['user'])
export class Roulette {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  result: string;

  @CreateDateColumn()
  usedAt: Date;
}
