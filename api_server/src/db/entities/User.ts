import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Connection } from 'typeorm'
import 'reflect-metadata'

import Activity from './Activity'

import { globalIdField } from 'graphql-relay'

import {
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
} from 'graphql-relay'

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @OneToMany(type => Activity, (activity: Activity) => activity.user)
  activities: Activity[]

  getActivities(_: any, { dbConn }: { dbConn: Connection }): Promise<Activity[]> {
    const activityRepository = dbConn.getRepository(Activity)

    return activityRepository
      .createQueryBuilder('activity')
      .select()
      .where(`activity.user = ${this.id}`)
      .getMany()
  }
}
