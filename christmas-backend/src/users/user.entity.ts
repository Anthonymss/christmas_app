import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
