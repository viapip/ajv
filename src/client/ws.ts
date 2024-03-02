import consola from 'consola'
import { WebSocket } from 'ws'

import type { Buffer } from 'node:buffer'
import type { ClientOptions } from 'ws'

const logger = consola.withTag('client')

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

export class WebSocketWrapperProxy extends WebSocket {
  constructor(
    address: string | URL,
    protocols?: string | string[],
    options?: ClientOptions,
  ) {
    super(address, protocols, options)

    return new Proxy(this, {
      get: (target, prop, receiver) => {
        switch (prop) {
          case 'on':
            return (
              event: string,
              listener: (
                this: WebSocket,
                data: BufferLike,
                ...args: any[]
              ) => void,
            ) => {
              const wrapper = async (
                data: BufferLike,
                ...args: any[]
              ) => {
                if (event === 'message') {
                  // await sleep(100)
                  logger.debug(
                    'Receiving',
                    event,
                    JSON.parse(data.toString()),
                  )
                }

                listener.call(
                  target,
                  data,
                  ...args,
                )
              }

              target.on(event, wrapper)
            }

          case 'send':
            return async (
              data: BufferLike,
              cb?: (error?: Error) => void,
            ) => {
              // await sleep(100)
              logger.debug('Sending', data)

              target.send(data, cb)
            }
        }

        return Reflect.get(
          target,
          prop,
          receiver,
        )
      },
    })
  }
}
