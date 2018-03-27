import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import 'reflect-metadata';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;
}
