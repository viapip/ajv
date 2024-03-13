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

  private getWrappedMethod<S>(target: S, prop: string) {
    const methods = {
      on: this.customOn.bind(target),
      send: this.customSend.bind(target),
    } as Record<string, (...args: any[]) => void>

    return methods[prop]
  }

  private getProxy<S extends object>(t: S) {
    return new Proxy(t, {
      get: (target, prop, receiver) => {
        if (prop === 'on') {
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
      if (event === 'connection') {
        const arg = args as [socket: InstanceType<T>, request: InstanceType<U>]
        const ws = this.getProxy(arg[0])
        arg[0] = ws

        listener.call(this, ...arg)
      }

      if (event === 'message') {
        await sleep(100)
        logger.info('Receiving', event, JSON.parse(args[0] as string))
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
    logger.info('Sending', event)
    logger.debug('Sending', event)
    this.emit(event, data)
  }
}
