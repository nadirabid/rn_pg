import express from 'express';
import http from 'http';
import convict from 'convict';
import path from 'path';
import { createConnection, Connection } from 'typeorm';

// setup config
const config: convict.Config = convict({
    port: {
        'arg': 'port',
        'default': null,
        'doc': 'The port the server should listen at.',
        'env': 'PORT',
        'format': 'port',
    },
    database: {
        url: {
            'arg': 'database.url',
            'default': null,
            'doc': 'The url for the database',
            'env': 
        }
    }
});

config.loadFile(path.join(__dirname, '../conf/development.json'));
config.validate();

// create app
const app: express.Express = express();

// start server
const server: http.Server = http.createServer(app);
server.listen(3000);
server.on('listening', () => {
    console.log('Server listening...');
});
server.on('error', (err: Error) => {
    console.error('Server crapped out: ', err);
});
