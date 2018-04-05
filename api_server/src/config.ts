import convict from 'convict'
import path from 'path'

// setup config

const config: convict.Config = convict({
  port: {
    'arg': 'port',
    'default': undefined,
    'format': 'port',
  },
  graphiql: {
    'arg': 'graphiql',
    'default': undefined,
    'format': 'Boolean',
  },
  db: {
    database: {
      'arg': 'db.database',
      'default': undefined,
      'format': 'String',
    },
    host: {
      'arg': 'db.host',
      'default': undefined,
      'format': 'url',
    },
    port: {
      'arg': 'db.port',
      'default': undefined,
      'format': 'port',
    },
    username: {
      'arg': 'db.username',
      'default': undefined,
      'format': 'String',
    },
    password: {
      'arg': 'db.password',
      'default': undefined,
      'format': 'String',
    },
    schema: {
      'arg': 'db.config',
      'default': undefined,
      'format': 'String',
    },
    synchronize: {
      'arg': 'db.synchronize',
      'default': undefined,
      'format': 'Boolean',
    },
  },
})

config.loadFile(path.join(__dirname, '../conf/development.json')) // TODO(Nadir): load this from a parameter /w/ default
config.validate()

export default config
