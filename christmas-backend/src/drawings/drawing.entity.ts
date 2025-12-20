import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

export type DrawingCategory = 'CONCURSO' | 'NAVIDAD_FEA';

@Entity('drawings')
export class Drawing {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ type: 'varchar', length: 20 })
  category: DrawingCategory;

  @Column()
  imageUrl: string;

  @Column({ default: 0 })
  votesCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
