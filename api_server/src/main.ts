import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import graphqlHTTP from 'koa-graphql'
import chalk from 'chalk'
import { Connection } from 'typeorm'
import path from 'path'
import fs from 'fs'
import { buildSchema } from 'graphql'

import config from './config'
import createConnection from './db/createConnection'
import testQuery from './db/testQuery'
import schema from './graphql/schema'
import { Server } from 'http'

let server: Server
let conn: Connection

async function startApp(): Promise<void> {
  // setup database
  try {
    conn = await createConnection(config)
  } catch (e) {
    console.error(e)
    console.log(chalk.redBright('Are you sure PostgreSQL is running?'))
    return
  }

  // setup router
  const router = new Router()
  router.all('/graphql', graphqlHTTP({
    schema: schema,
    context: {
      dbConn: conn,
    },
    graphiql: config.get('graphiql'),
  }))

  // create app
  const app = new Koa()

  app.use(bodyParser())
  app.use(router.routes())

  server = app.listen(config.get('port'))

  app.on('error', (err: Error) => {
    console.error('Server crapped out: ', err)
  })

  const url = chalk.underline.greenBright(`http://localhost:${config.get('port')}`)
  console.log(`Server running at: ${url}`)
}

function stopApp() {
  server.close()
}

// start things up
startApp()
process.on('exit', stopApp)
