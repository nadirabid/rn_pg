import { Connection } from 'typeorm';

import User from './entities/User';
import Activity from './entities/Activity';

export default async function seedData(conn: Connection): Promise<void> {
  const userRepository = conn.getRepository(User);
  const activityRepository = conn.getRepository(Activity);

  const userNadir = new User();
  userNadir.firstName = 'Nadir';
  userNadir.lastName = 'Muzaffar';

  await userRepository.save(userNadir);

  const activity1 = new Activity();
  activity1.user = userNadir;

  await activityRepository.save(activity1);

  const activity2 = new Activity();
  activity2.user = userNadir;

  await activityRepository.save(activity2);
}
