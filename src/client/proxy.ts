import { sleep } from '@antfu/utils'
import consola from 'consola'
import { WebSocket } from 'ws'

import type { Buffer } from 'node:buffer'
import type { ClientOptions } from 'ws'

const logger = consola.withTag('client/ws')

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
  | { valueOf: () => ArrayBuffer }
  | { valueOf: () => SharedArrayBuffer }
  | { valueOf: () => Uint8Array }
  | { valueOf: () => readonly number[] }
  | { valueOf: () => string }
  | { [Symbol.toPrimitive]: (hint: string) => string }

export class WebSocketProxy extends WebSocket {
  public constructor(
    address: string | URL,
    protocols?: string | string[],
    options?: ClientOptions,
  ) {
    super(address, protocols, options)

    wrapSocket(this)
  }
}

function wrapSocket(ws: WebSocket) {
  const wrappedMethods = {
    on: customOn.bind(ws),
    send: customSend.bind(ws),
  }

  return new Proxy(ws, {
    get: (target, prop, receiver) => {
      if (prop === 'on' || prop === 'send') {
        return wrappedMethods[prop]
      }

      return Reflect.get(target, prop, receiver)
    },
  })
}

async function customOn(
  this: WebSocket,
  event: string,
  listener: (...args: any[]) => void,
) {
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

async function customSend(
  this: WebSocket,
  data: BufferLike,
  cb?: (error?: Error) => void,
) {
  await sleep(100)
  logger.debug('Sending', data)

  this.send(data, cb)
}
