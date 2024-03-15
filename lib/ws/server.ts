import consola from 'consola'
import { WebSocketServer } from 'ws'

import { jwks, keys2 } from '@/jose/keys'
import { sign, verify } from '@/jose/sign'

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
  | { valueOf: () => ArrayBuffer }
  | { valueOf: () => SharedArrayBuffer }
  | { valueOf: () => Uint8Array }
  | { valueOf: () => readonly number[] }
  | { valueOf: () => string }
  | { [Symbol.toPrimitive]: (hint: string) => string }

export class WebSocketProxy<
  T extends typeof WebSocket.WebSocket = typeof WebSocket.WebSocket,
  U extends typeof IncomingMessage = typeof IncomingMessage,
> extends WebSocketServer {
  constructor(
    options?: ServerOptions<T, U>,
    callback?: () => void,
  ) {
    super(options, callback)

    logger.info('Created')
    // const wrappedMethods = {
    //   on: this.customOn.bind(this),
    //   // send: this.customSend.bind(this),
    // }

    return this.getProxy(this)
  }

  private getWrappedMethod<S extends WebSocketServer | WebSocket>(target: S, prop: string) {
    const methods = {
      on: this.customOn.bind(target),
      send: this.customSend.bind(target),
      emit: this.customSend.bind(target),
    } as Record<string, (...args: any[]) => void>

    return methods[prop]
  }

  private getProxy<S extends WebSocketServer | WebSocket>(t: S) {
    return new Proxy(t, {
      get: (target, prop, receiver) => {
        if (prop === 'on' || prop === 'send') {
          return this.getWrappedMethod(target, prop)
        }

        return Reflect.get(target, prop, receiver)
      },
    })
  }

  private async customOn(
    event: string,
    listener: (this: WebSocketServer, ...args: any[]) => void,
  ) {
    this.on(event, async (...args: any[]) => {
      logger.info('Received', event)
      if (event === 'connection') {
        const arg = args as [socket: InstanceType<T>, request: InstanceType<U>]
        const ws = this.getProxy(arg[0])
        arg[0] = ws

        listener.call(this, ...arg)

        return
      }

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
    this: WebSocket | WebSocketServer,
    data: BufferLike,
    cb?: (error?: Error) => void,
  ) {
    if ('send' in this) {
      const jws = await sign(keys2, JSON.parse(data.toString()))

      return this.send(jws, cb)
    }
  }
}
