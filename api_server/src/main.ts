import * as express from 'express';
import * as http from 'http';
import * as convict from 'convict';
import * as path from 'path';

// setup config
const config: convict.Config = convict.default({
    port: {
        'arg': 'port',
        'doc': 'The port the server should listen at.',
        'default': null,
        'env': 'PORT',
        'format': 'port',
    }
});

config.loadFile(path.join(__dirname, '../conf/development.json'));
config.validate();

// create app
const app: express.Express = express.default();

// start server
const server: http.Server = http.createServer(app);
server.listen(3000);
server.on('listening', () => {
    console.log('Server listening...');
});
server.on('error', (err: Error) => {
    console.error('Server crapped out: ', err);
});
