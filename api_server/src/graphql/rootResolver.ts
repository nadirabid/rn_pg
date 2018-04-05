
import { Connection } from 'typeorm'

import User from '../db/entities/User'
import Activity from '../db/entities/Activity'

// The root provides a resolver function for each API endpoint
export default {
  async user({ id }: { id: number }, { dbConn }: { dbConn: Connection }) {
    const userRepository = dbConn.getRepository(User)

    return userRepository.findOneById(id)
  },

  async activity({ id }: { id: number }, { dbConn }: { dbConn: Connection }) {
    const activityRepository = dbConn.getRepository(Activity)

    return await activityRepository.findOneById(id)
  },

  async createUser({ firstName, lastName }: { firstName: string, lastName: string }, { dbConn }: { dbConn: Connection }) {
    const userRepository = dbConn.getRepository(User)

    const user = new User()
    user.firstName = firstName
    user.lastName = lastName

    return userRepository.save(user)
  },

  async createActivity({ userID }: { userID: number }, { dbConn }: { dbConn: Connection }) {
    const activityRepository = dbConn.getRepository(Activity)
    const userRepository = dbConn.getRepository(User)

    const user = await userRepository.findOneById(userID)

    if (user === undefined) {
      throw `User by userId of ${userID} does not exist. Cannot create Activity.`
    }

    const activity = new Activity()
    activity.user = user

    return activityRepository.save(activity)
  },
}
