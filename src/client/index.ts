import process from 'node:process'

import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client'
import consola from 'consola'

import type { AppRouter } from '~/server/router'
import { transformer } from '~/transformer'

import { WebSocketWrapperProxy } from './ws'

const logger = consola.withTag('client')

const wsClient = createWSClient({
  WebSocket: WebSocketWrapperProxy as any,
  url: 'ws://localhost:4000',
  onOpen() {
    logger.log('Connected')
  },
  onClose() {
    logger.log('Disconnected')
  },
})

const client = createTRPCProxyClient<AppRouter>({
  links: [wsLink({ client: wsClient })],
  transformer,
})

const users = await client.users.userList.query()
const subscription = client.users.randomNumber.subscribe(2, {
  onStarted() {
    logger.log('Subscription started')
  },
  onData(data) {
    logger.log('Subscription data', data)
  },
  onError(err) {
    logger.error('Subscription error', err)
  },
  onComplete() {
    logger.log('Subscription ended')
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

  const { id } = await client.users.userCreate.mutate({
    id: `${Math.floor(Math.random() * 1000)}`,
    age: 30,
    name,
  })

  // await Promise.all(
  //   users.map(async ({ id }) => {
  //     const user = await trpc.users.userById.query(id)
  //     logger.log('User name:', user?.name, user?.id)
  //   }),
  // )

  const user = await client.users.userById.query(id)
  if (!user) {
    continue
  }

  users.push(user)
  logger.log('User name:', user?.name, user?.id)
}

process.exit(0)
