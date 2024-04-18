import process from 'node:process'

import { next as A } from '@automerge/automerge'
import {
  createTRPCProxyClient,
  createWSClient,
  wsLink,
} from '@trpc/client'
import consola from 'consola'
import { sleep } from 'radash'

import { transformer } from '@/superjson'
import { stringToUint8Array } from '@/transformer'
import { WebSocketProxy } from '@/ws'

import type { Router } from '~/server/router'

const logger = consola.withTag('client')

const wsClient = createWSClient({
  url: 'ws://localhost:4000',
  WebSocket: WebSocketProxy as any,

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

const id = `${Number.parseInt(process.argv[2], 10) || 1}`
let doc = A.load<{ ideas: string[]; name: string }>(stringToUint8Array(await client.docs.getItem.query(id)))

logger.log(doc)

const subscription = client.docs.onChange.subscribe(undefined, {
  onStarted() {
    logger.info('Subscription started')
  },
  onData(data) {
    logger.success('Subscription data', data)
    const res = A.applyChanges(doc, [stringToUint8Array(data.lastChange)])
    doc = res[0]
    logger.log(test)
  },
  onError(err) {
    logger.error('Subscription error', err)
  },
  onComplete() {
    logger.info('Subscription ended')
  },
})

while (true) {
  await sleep(1000)
  const res = await client.docs.putItem.mutate({
    id,
    doc: {
      name: `test-${Math.floor(Math.random() * 1000)}`,
      ideas: Array.from({ length: 10 }).map(() => `${Math.floor(Math.random() * 1000)}`),
    },
  })

  logger.log(res)
}

subscription.unsubscribe()
process.exit(0)
