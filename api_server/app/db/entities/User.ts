import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import 'reflect-metadata';

import Activity from './Activity';

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @OneToMany(type => Activity, activity => activity.user)
    activities: Activity[];
}
