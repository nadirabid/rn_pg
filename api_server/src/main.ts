import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import convict from 'convict';
import path from 'path';
import { createConnection, Connection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

(async () => {

// setup config
const config: convict.Config = convict({
    port: {
        'arg': 'port',
        'default': null,
        'format': 'port',
    },
    db: {
        database: {
            'arg': 'db.database',
            'default': null,
            'format': String,
        },
        host: {
            'arg': 'db.host',
            'default': null,
            'format': 'url'
        },
        port: {
            'arg': 'db.port',
            'default': null,
            'format': 'port',
        },
        username: {
            'arg': 'db.username',
            'default': null,
            'format': String,
        },
        password: {
            'arg': 'db.password',
            'default': null,
            format: String
        }
    }
});

config.loadFile(path.join(__dirname, '../conf/development.json'));
config.validate();

// setup database
const options: PostgresConnectionOptions = {
    type: 'postgres',
    host: config.get('db.host'),
    port: config.get('db.port'),
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.database'),
    synchronize: true,
    logging: false,
    entities: [
        path.join(__dirname, '/entities/**/*.ts')
    ]
};

const conn: Connection = await createConnection(options);

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

await conn.close();

})();