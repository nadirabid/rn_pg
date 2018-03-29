import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import graphqlHTTP from 'koa-graphql';
import chalk from 'chalk';

import config from './config';
import createConnection from './db/createConnection';
import { root, schema } from './graphql/schema';

async function runApp() {
    // setup database
    try {
        await createConnection(config);
    } catch (e) {
        console.error(e);
        console.log(chalk.redBright('Are you sure PostgreSQL is running?'));
        return;
    }
    // setup router
    const router = new Router();
    router.all('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
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
