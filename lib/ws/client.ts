import { WebSocket } from 'ws'

import { jwks, keys1 } from '@/jose/keys'
import { sign, verify } from '@/jose/sign'

import type { Buffer } from 'node:buffer'
import type { ClientOptions } from 'ws'

// import consola from 'consola'
// const logger = consola.withTag('client/ws')

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

export class WebSocketProxy extends WebSocket {
  constructor(
    address: string | URL,
    protocols?: string | string[],
    options?: ClientOptions,
  ) {
    super(address, protocols, options)
    const wrappedMethods = {
      on: this.customOn.bind(this),
      send: this.customSend.bind(this),
    }

    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (prop === 'on' || prop === 'send') {
          return wrappedMethods[prop]
        }

        return Reflect.get(target, prop, receiver)
      },
    })
  }

  private async customOn(
    event: string,
    listener: (this: WebSocket, ...args: any[]) => void,
  ) {
    this.on(event, async (...args: any[]) => {
      if (event === 'message') {
        const [data, isBinary] = args as [BufferLike, boolean]

        const jws = await verify(data.toString(), jwks)
        listener.call(this, JSON.stringify(jws), isBinary)

        return
      }

      listener.call(this, ...args)
    })
  }

  private async customSend(
    data: BufferLike,
    cb?: (error?: Error) => void,
  ) {
    const jws = await sign(keys1, JSON.parse(data.toString()))

    this.send(jws, cb)
  }
}
