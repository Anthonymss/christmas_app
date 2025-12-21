import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('prize')
export class Prize {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('int')
    stock: number;
}
