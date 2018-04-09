import { Connection } from 'typeorm'
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLSchema,
} from 'graphql'
import {
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
  connectionDefinitions,
  connectionArgs,
  mutationWithClientMutationId,
  connectionFromArray,
  cursorForObjectInConnection,
  connectionFromPromisedArray,
  connectionFromArraySlice,
  cursorToOffset,
} from 'graphql-relay'

import User from '../db/entities/User'
import Activity from '../db/entities/Activity'
import { StringDecoder } from 'string_decoder'

const { nodeInterface, nodeField, nodesField } = nodeDefinitions(
  (globalId, { dbConn }: { dbConn: Connection }) => {
    const { type, id } = fromGlobalId(globalId)

    switch (type) {
      case 'User':
        const userRepository = dbConn.getRepository(User)
        return userRepository.findOneById(id)
      case 'Activity':
        const activityRepository = dbConn.getRepository(Activity)
        return activityRepository.findOneById(id)
      default:
        return undefined
    }
  },
  obj => {
    switch (true) {
      case obj instanceof UserType:
        return UserType
      case obj instanceof ActivityType:
        return ActivityType
      default:
        return false
    }
  },
)

// querable

const ActivityType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Activity',
  interfaces: [ nodeInterface ],
  fields: () => ({
    id: globalIdField('Activity'),
    getUser: {
      type: UserType,
      resolve: (activity: Activity, args: any, ctx: any) => {
        return activity.getUser(args, ctx)
      },
    },
  }),
})

const {
  connectionType: ActivityConnection,
  edgeType: ActivityTypeEdge,
} = connectionDefinitions({ nodeType: ActivityType })

const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  interfaces: [ nodeInterface ],
  fields: () => ({
    id: globalIdField('User'),
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    getActivities: {
      type: ActivityConnection,
      args: connectionArgs,
      resolve: async (user: User, args: any, ctx: any) => {
        let take: number | undefined
        if (args.first) {
          take = args.first
        }

        // after of undefined === skip of 0
        // after of 0 === skip 0 + 1
        // after of n === skip n + 1

        let skip: number | undefined
        if (args.after) {
          skip = cursorToOffset(args.after) + 1
        }

        const [activities, count] = await user.getActivities({ take, skip }, ctx)

        return connectionFromArraySlice(activities, args, {
          sliceStart: skip ? skip : 0,
          arrayLength: count,
        })
      },
    },
  }),
})

const Root: GraphQLObjectType = new GraphQLObjectType({
  name: 'Root',
  fields: {
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (src: any, { id }, { dbConn }: { dbConn: Connection }) => {
        const { id: userID } = fromGlobalId(id)
        const userRepository = dbConn.getRepository(User)

        return userRepository.findOneById(userID)
      },
    },
    activity: {
      type: ActivityType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (src: any, { id }, { dbConn }: { dbConn: Connection }) => {
        const { id: activityID } = fromGlobalId(id)
        const activityRepository = dbConn.getRepository(Activity)

        return activityRepository.findOneById(activityID)
      },
    },
  },
})

// mutable

const CreateUserMutation = mutationWithClientMutationId({
  name: 'createUser',
  inputFields: {
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    user: {
      type: UserType,
    },
  },
  mutateAndGetPayload: async ({ firstName, lastName}: { firstName: string, lastName: string }, { dbConn }: { dbConn: Connection }) => {
    const userRepository = dbConn.getRepository(User)

    const user = new User()
    user.firstName = firstName
    user.lastName = lastName

    await userRepository.save(user)
    return { user }
  },
})

const CreateActivityMutation = mutationWithClientMutationId({
  name: 'createActivity',
  inputFields: {
    userID: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    activity: {
      type: ActivityType,
    },
    activityEdge: {
      type: ActivityTypeEdge,
      resolve: (activity: Activity) => {
        return {
          cursor: cursorForObjectInConnection(),
        }
      },
    },
  },
  mutateAndGetPayload: async ({ userID: globalUserID }: { userID: string }, { dbConn }: { dbConn: Connection }) => {
    const userID = fromGlobalId(globalUserID)
    const activityRepository = dbConn.getRepository(Activity)
    const userRepository = dbConn.getRepository(User)

    const user = await userRepository.findOneById(userID)

    if (user === undefined) {
      throw `User by userId of ${userID} does not exist. Cannot create Activity.`
    }

    const activity = new Activity()
    activity.user = user

    await activityRepository.save(activity)

    return { activity }
  },
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: CreateUserMutation,
    createActivity: CreateActivityMutation,
  },
})

// schema

export default new GraphQLSchema({
  query: Root,
  mutation: Mutation,
})
