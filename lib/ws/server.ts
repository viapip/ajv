import { sleep } from '@antfu/utils'
import consola from 'consola'
import { WebSocketServer } from 'ws'

import type { Buffer } from 'node:buffer'
import type { IncomingMessage } from 'node:http'
import type { ServerOptions, WebSocket } from 'ws'

const logger = consola.withTag('ws/server')

type BufferLike =
    | string
    | Buffer
    | DataView
    | number
    | ArrayBufferView
    | Uint8Array
    | ArrayBuffer
    | SharedArrayBuffer
    | readonly any[]
    | readonly number[]
    | { valueOf(): ArrayBuffer }
    | { valueOf(): SharedArrayBuffer }
    | { valueOf(): Uint8Array }
    | { valueOf(): readonly number[] }
    | { valueOf(): string }
    | { [Symbol.toPrimitive](hint: string): string }

export class WebSocketProxy<
T extends typeof WebSocket.WebSocket = typeof WebSocket.WebSocket,
U extends typeof IncomingMessage = typeof IncomingMessage,
> extends WebSocketServer {
  constructor(
    options: ServerOptions<T, U>,
    callback?: () => void,
  ) {
    super(options, callback)
    logger.info('Created')
    const wrappedMethods = {
      on: this.customOn.bind(this),
      send: this.customSend.bind(this),
    }

    return new Proxy(this, {
      get: (target, prop, receiver) => {
        logger.info('123', prop)
        if (prop === 'on' || prop === 'send') {
          return wrappedMethods[prop]
        }

        return Reflect.get(target, prop, receiver)
      },
    })
  }

  private async customOn(
    event: string,
    listener: (this: WebSocketServer, ...args: any[]) => void,
  ) {
    console.log('event', event)

    this.on(event, async (...args: any[]) => {
      if (event === 'message') {
        await sleep(100)
        logger.debug('Receiving', event, JSON.parse(args[0] as string))
        const [data, isBinary] = args as [BufferLike, boolean]
        listener.call(this, data, isBinary)

        return
      }

      listener.call(this, ...args)
    })
  }

  private async customSend(event: string | symbol, data: BufferLike) {
    await sleep(100)
    logger.debug('Sending', event)
    this.emit(event, data)
  }
}
