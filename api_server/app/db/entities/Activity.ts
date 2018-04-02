import { Entity, ManyToOne, PrimaryGeneratedColumn, Connection } from 'typeorm';
import 'reflect-metadata';

import User from './User';

@Entity()
export default class Activity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, (user: User) => user.activities)
    user: User;

    getUser(_: any, { dbConn }: { dbConn: Connection }): Promise<User | undefined> {
        const userRepository = dbConn.getRepository(User);

        return userRepository
            .createQueryBuilder('user')
            .select()
            .innerJoin('user.activities', 'activity', `user.id = activity.user AND activity.id = ${this.id}`)
            .getOne();
    }
}
