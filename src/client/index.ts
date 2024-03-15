import process from 'node:process'

import {
  createTRPCProxyClient,
  createWSClient,
  wsLink,
} from '@trpc/client'
import consola from 'consola'

import { transformer } from '@/transformer'
import { WebSocketProxy } from '@/ws'

import type { Router } from '~/server/router'

// import { WebSocketProxy } from './proxy'

const logger = consola.withTag('client')

const ws = createWSClient({
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
  links: [wsLink({ client: ws })],
  transformer,
})

const n = Number.parseInt(process.argv[2], 10) || 1
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
  // await Promise.all(
  //   users.map(async ({ id }) => {
  //     const user = await client.data.getItem.query(id)
  //     logger.info('User name:', user?.name, user?.id)
  //   }),
  // )

  const name = await logger
    .prompt('Enter user name: ', {
      type: 'text',
      required: true,
    })

  if (typeof name !== 'string') {
    logger.info('Invalid name')
    subscription.unsubscribe()
    break
  }

  const { _id } = await client.data.postItem.mutate({
    id: `${Math.floor(Math.random() * 1000)}`,
    schemaId: 'User',
    data: {
      status: 'active',
      info: {
        name,
        email: `${name}@example.com`,
      },
    },
  }) as { _id: string }

  const user = await client.data.getItem.query(_id)
  if (user) {
    users.push(user)
    logger.info('User', user)
  }
}

process.exit(0)
