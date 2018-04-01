
import { Connection } from 'typeorm';

import User from '../db/entities/User';
import Activity from '../db/entities/Activity';

// The root provides a resolver function for each API endpoint
export default {
    user: async ({ id }: { id: number }, { dbConn }: { dbConn: Connection }) => {
        const userRepository = dbConn.getRepository(User);

        return userRepository
            .createQueryBuilder('user')
            .select()
            .innerJoinAndSelect('user.activities', 'activity')
            .where(`activity.user = ${id}`)
            .getOne()
    },
    activity: async ({ id }: { id: number }, { dbConn }: { dbConn: Connection }) => {
        const activityRepository = dbConn.getRepository(Activity);

        return await activityRepository.findOneById(id);
    },
    createUser: async ({ firstName, lastName }: { firstName: string, lastName: string }, { dbConn }: { dbConn: Connection }) => {
        const userRepository = dbConn.getRepository(User);

        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;

        return userRepository.save(user);
    },
    createActivity: async ({ userID }: { userID: number }, { dbConn }: { dbConn: Connection }) => {
        const activityRepository = dbConn.getRepository(Activity);
        const userRepository = dbConn.getRepository(User);

        const user = await userRepository.findOneById(userID);

        if (user === undefined) {
            throw new Error(`User by userId of ${userID} does not exist. Cannot create Activity.`);
        }

        const activity = new Activity();
        activity.user = user;

        return activityRepository.save(activity);
    }
};
