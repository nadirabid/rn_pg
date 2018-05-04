import { Connection } from 'typeorm'
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLSchema,
  GraphQLInt,
  GraphQLScalarType,
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
  offsetToCursor,
} from 'graphql-relay'

import User from '../db/entities/User'
import Activity from '../db/entities/Activity'

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
      case obj instanceof User:
        return UserType
      case obj instanceof Activity:
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
    created: {
      type: GraphQLString,
    },
    modified: {
      type: GraphQLString,
    },
    duration: {
      type: GraphQLInt,
      resolve: (activity: Activity) => {
        return 0
      },
    },
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
    node: nodeField,
    nodes: nodesField,
    users: {
      type: new GraphQLList(UserType),
      resolve: async (src: any, args: any, { dbConn }: { dbConn: Connection }) => {
        const userRepository = dbConn.getRepository(User)
        return userRepository.find()
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
      resolve: ({ activity, offset }: { activity: Activity, offset: number }) => {
        return {
          cursor: offsetToCursor(offset),
          node: activity,
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
    activity.duration = 100

    await activityRepository.save(activity)

    const rowCount = await dbConn
      .createQueryBuilder()
      .select('activity_row.row_number', 'row_number')
      .addSelect('activity_row.id', 'id')
      .from(subQuery => {
        return subQuery
          .select('activity.id', 'id')
          .addSelect('row_number() over (order by activity.id)', 'row_number')
          .from(Activity, 'activity')
      }, 'activity_row')
      .where(`activity_row.id = ${activity.id}`)
      .getRawOne()

    return { activity, offset: rowCount.row_number }
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
