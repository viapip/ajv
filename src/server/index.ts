import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import consola from 'consola'
import { WebSocketServer } from 'ws'

import { createContext } from './context'
import { router } from './router'

import type { Router } from './router'

const logger = consola.withTag('server')

export const app = createHTTPServer({
  router,
  createContext,
  batching: { enabled: true },

  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      logger.error(error)
    }
  },
})

applyWSSHandler<Router>({
  wss: new WebSocketServer(app),

  router,
  createContext,
  batching: { enabled: true },

  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      logger.error(error)
    }
  },
})

app.listen(4000)
