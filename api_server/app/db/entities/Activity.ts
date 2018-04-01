import {Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import 'reflect-metadata';

import User from './User';

@Entity()
export default class Activity {
    @PrimaryGeneratedColumn() 
    id: number;

    @ManyToOne(type => User, user => user.activities)
    user: User;
}
