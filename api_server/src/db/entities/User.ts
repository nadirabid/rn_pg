import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Connection } from 'typeorm'
import 'reflect-metadata'

import Activity from './Activity'

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

  getActivities({ first }: { first: number | undefined }, { dbConn }: { dbConn: Connection }): Promise<Activity[]> {
    const activityRepository = dbConn.getRepository(Activity)

    let query = activityRepository
      .createQueryBuilder('activity') // this is the Alias. Alias is what you're selecting
      .select()
      .where(`activity.user = ${this.id}`)

      if (first) {
        query = query.take(first)
      }

      return query.getMany()
  }
}
