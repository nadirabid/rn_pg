import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import graphqlHTTP from 'koa-graphql';
import chalk from 'chalk';
import { Connection } from 'typeorm';
import path from 'path';
import fs from 'fs'
import { buildSchema } from 'graphql';

import config from './config';
import createConnection from './db/createConnection';
import seedData from './db/seedData';
import rootResolver from './graphql/rootResolver';

async function runApp() {
    // setup database
    let conn: Connection;
    try {
        conn = await createConnection(config);
    } catch (e) {
        console.error(e);
        console.log(chalk.redBright('Are you sure PostgreSQL is running?'));
        return;
    }

    await seedData(conn);
    
    // setup router
    const router = new Router();
    router.all('/graphql', graphqlHTTP({
        schema: buildSchema(fs.readFileSync(path.join(__dirname, '/graphql/schema.graphql'), 'utf8')),
        rootValue: rootResolver,
        context: {
            dbConn: conn
        },
        graphiql: config.get('graphiql')
    }));

    // create app
    const app = new Koa();

    app.use(bodyParser());
    app.use(router.routes());

    app.listen(config.get('port'));

    app.on('error', (err: Error) => {
        console.error('Server crapped out: ', err);
    });

    const url = chalk.underline.greenBright(`http://localhost:${config.get('port')}`);
    console.log(`Server running at: ${url}`);
}

runApp();
