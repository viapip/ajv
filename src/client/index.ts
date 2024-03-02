import process from 'node:process'

import {
  createTRPCProxyClient,
  createWSClient,
  wsLink,
} from '@trpc/client'
import consola from 'consola'

import type { Router } from '~/server/router'
import { transformer } from '~/transformer'

import { WebSocketProxy } from './ws'

const logger = consola.withTag('client')

const wsClient = createWSClient({
  WebSocket: WebSocketProxy as any,
  url: 'ws://localhost:4000',
  onOpen() {
    logger.info('Connected')
  },
  onClose() {
    logger.info('Disconnected')
  },
})

const client = createTRPCProxyClient<Router>({
  links: [wsLink({ client: wsClient })],
  transformer,
})

const n = Number.parseInt(process.argv[2] || '1', 10)
const users = await client.data.getAll.query()

const subscription = client.data.randomNumber.subscribe(n, {
  onStarted() {
    logger.info('Subscription started')
  },
  onData(data) {
    logger.success('Subscription data', data)
  },
  onError(err) {
    logger.error('Subscription error', err)
  },
  onComplete() {
    logger.info('Subscription ended')
  },
})

while (true) {
  const name = await logger
    .prompt('Enter user name: ', {
      type: 'text',
      required: true,
    })

  if (typeof name !== 'string') {
    subscription.unsubscribe()
    break
  }

  const { id } = await client.data.postItem.mutate({
    id: `${Math.floor(Math.random() * 1000)}`,
    schemaId: 'User',
    data: {
      age: 30,
      name,
      point: {
        type: 'Point',
        coordinates: [0, 0],
      },
    },
  })

  // await Promise.all(
  //   users.map(async ({ id }) => {
  //     const user = await client.data.getItem.query(id)
  //     logger.info('User name:', user?.name, user?.id)
  //   }),
  // )

  const user = await client.data.getItem.query(id)
  if (!user) {
    continue
  }

  users.push(user)
  logger.info('User name:', user.name, user.id)
}

process.exit(0)
