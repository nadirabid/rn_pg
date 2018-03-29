import { buildSchema} from 'graphql';

export var schema = buildSchema(`
  type Activity {
     id: ID!
     userId: ID!
     type: String
  }
  
  type User {
     id: ID!
     firstName: String
     lastName: String
     activitiesByUserId(userId: ID!): [Activity]
  }
  
  type Query {
    user(id: ID!): User
    activitiesByUserId(userId: ID): [Activity]
  }
`);

const activites = [
    {
        id: 1,
        userId: 3,
        type: 'running',
    },
    {
        id: 2,
        userId: 3,
        type: 'walking',
    },
    {
        id: 3,
        userId: 4,
        type: 'biking'
    }
];

// The root provides a resolver function for each API endpoint
export var root = {
    user: ({ id }: { id: number }) => {
        return {
            id: 1,
            firstName: 'nadir',
            lastName: 'muzaffar',
            activitiesByUserId: root.activitiesByUserId({ userId: id })
        }
    },
    activitiesByUserId: ({ userId }: { userId: number }) => {
        return activites.filter(a => a.userId == userId);
    }
};

