import { Connection } from 'typeorm'

import User from './entities/User'
import Activity from './entities/Activity'

export default async function testQuery(conn: Connection): Promise<void> {
  const userRepository = conn.getRepository(User)
  const activityRepository = conn.getRepository(Activity)

  console.log('### TEST QUERY ###')

  const results = await conn
    .createQueryBuilder()
    .select('activity_row.row_number', 'row_number')
    .addSelect('activity_row.id', 'id')
    .from(subQuery => {
      return subQuery
        .select('activity.id', 'id')
        .addSelect('row_number() over (order by activity.id)', 'row_number')
        .from(Activity, 'activity')
    }, 'activity_row')
    .where(`activity_row.id = 255`)
    .getRawMany()

  console.log('results', results)
}
