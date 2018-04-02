import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import path from 'path';
import { Connection, createConnection } from 'typeorm';
import convict from 'convict';

export default async function (config: convict.Config): Promise<Connection> {
  const options: PostgresConnectionOptions = {
    type: 'postgres',
    host: config.get('db.host'),
    port: config.get('db.port'),
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.database'),
    schema: config.get('db.schema'),
    synchronize: config.get('db.synchronize'),
    logging: true,
    entities: [
      path.join(__dirname, './entities/*.ts')
    ],
    migrations: [
      __dirname + "/migrations/*{.js,.ts}"
    ],
    migrationsTableName: "ryden_migration_table"
  };

  return createConnection(options);
}
