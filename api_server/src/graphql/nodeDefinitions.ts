import { Connection } from 'typeorm'
import { nodeDefinitions, fromGlobalId } from 'graphql-relay'

import { assignType, getType } from '../utils'

// https://github.com/kriasoft/nodejs-api-starter
// https://github.com/kriasoft/react-starter-kit

export const { nodeInterface, nodeField, nodesField } = nodeDefinitions(
  (globalId, { dbConn }: { dbConn: Connection }) => {
    const { type, id } = fromGlobalId(globalId)

    switch (type) {
      case 'User':
        return context.userById.load(id).then(assignType('User'))
      default:
        return undefined
    }
  },
  obj => {
    switch (getType(obj)) {
      case 'User':
        return require('./user/UserType').default
      default:
        return undefined
    }
  },
)
