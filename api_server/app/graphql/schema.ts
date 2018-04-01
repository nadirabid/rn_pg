import { buildSchema} from 'graphql';
import fs from 'fs'
import path from 'path';

export const schema = buildSchema(fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'));

// The root provides a resolver function for each API endpoint
export const rootResolver = {
    user: ({ id }: { id: number }) => {
        return {
            id: 1,
            firstName: 'nadir',
            lastName: 'muzaffar'
        }
    },
    activity: ({ id }: { id: number }) => {
        return {
            id: 1,
            userId: 1
        }
    },
    createUser: ({ firstName, lastName }: { firstName: string, lastName: string }) => {
        return {};
    },
    createActivity: ({ userID }: { userID: number }) => {
        return {};
    }
};
