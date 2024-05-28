import process from 'node:process'

import {
  createTRPCProxyClient,
  createWSClient,
  wsLink,
} from '@trpc/client'
import consola from 'consola'
import { Loro } from 'loro-crdt'
import { sleep } from 'radash'

import type { DocType } from '@/automerge'
import { transformer } from '@/superjson'
import { WebSocketProxy } from '@/ws'

import type { Router } from '~/server/router'

import type { LoroMap } from 'loro-crdt'

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
const root = new Loro<{ docs: LoroMap<Record<string, DocType>> }>()

logger.log(root)

const subscription = client.docs.onChange.subscribe(undefined, {
  onStarted() {
    logger.info('Subscription started')
  },
  onData(data) {
    logger.success('Subscription data', JSON.stringify(data))
  },
  onError(err) {
    logger.error('Subscription error', err)
  },
  onComplete() {
    logger.info('Subscription ended')
  },
})

while (true) {
  await sleep(100)
  const res = await client.docs.putItem.mutate({
    id,
    doc: {
      name: `test-${Math.floor(Math.random() * 1000)}`,
      ideas: Array
        .from({ length: 1000 })
        .map(() => `${Math.floor(Math.random() * 1000)}`),
    },
  })

  logger.log(res)
}

subscription.unsubscribe()
process.exit(0)
