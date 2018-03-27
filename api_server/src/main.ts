import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import config from './config';
import createConnection from './db/createConnection';
import { Connection } from 'typeorm';

async function startApp() {
    // setup database
    const conn: Connection = await createConnection(config);

    // create app
    const app: express.Express = express();
    app.use(bodyParser.json());

    // start server
    const server: http.Server = http.createServer(app);

    server.listen(config.get('port'));

    server.on('listening', () => {
        console.log(`Server listening on ${config.get('port')}`);
    });

    server.on('error', (err: Error) => {
        console.error('Server crapped out: ', err);
    });

    // await conn.close();
    // console.log('Connection closed')
}

startApp();

