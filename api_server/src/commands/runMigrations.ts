import config from '../config';
import createConnection from '../db/createConnection';
import { Connection } from 'typeorm';

async function runMigrations() {
    try {
        const conn: Connection = await createConnection(config);
        conn.runMigrations();
    } catch (e) {
        console.error('Error while trying to run migrations: ', e);
    }
}

runMigrations();
