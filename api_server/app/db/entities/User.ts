import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Connection } from 'typeorm';
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

    getActivities(_: any, { dbConn }: { dbConn: Connection }): Promise<Activity[]> {
        const activityRepository = dbConn.getRepository(Activity);

        return activityRepository
            .createQueryBuilder('activity')
            .select()
            .where(`activity.user = ${this.id}`)
            .getMany();
    }
}
