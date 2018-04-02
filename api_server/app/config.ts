import convict from 'convict';
import path from 'path';

// setup config

const config: convict.Config = convict({
  port: {
    'arg': 'port',
    'default': null,
    'format': 'port',
  },
  graphiql: {
    'arg': 'graphiql',
    'default': null,
    'format': 'Boolean',
  },
  db: {
    database: {
      'arg': 'db.database',
      'default': null,
      'format': 'String'
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
      'format': 'String'
    },
    password: {
      'arg': 'db.password',
      'default': null,
      'format': 'String'
    },
    schema: {
      'arg': 'db.config',
      'default': null,
      'format': 'String'
    },
    synchronize: {
      'arg': 'db.synchronize',
      'default': null,
      'format': 'Boolean'
    }
  }
});

config.loadFile(path.join(__dirname, '../conf/development.json')); // TODO(Nadir): load this from a parameter /w/ default
config.validate();

export default config;
