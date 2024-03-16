import { decode, encode } from '@msgpack/msgpack'
import consola from 'consola'

import type { DataTransformerOptions } from '@trpc/server'

const logger = consola.withTag('server/trpc/transformer')

function uint8ArrayToString(arr: Uint8Array) {
  return Array.from(arr)
    .map(byte => String.fromCharCode(byte))
    .join('')
}

function stringToUint8Array(str: string) {
  return new Uint8Array(Array.from(str)
    .map(char => char.charCodeAt(0)))
}

export const transformer: DataTransformerOptions = {
  input: {
    serialize: (obj: unknown) => {
      logger.debug('input.serialize', obj)

      return uint8ArrayToString(encode(obj))
    },
    deserialize: (obj: string) => {
      logger.debug('input.deserialize', obj)

      return decode(stringToUint8Array(obj))
    },
  },
  output: {
    serialize: (obj: unknown) => {
      logger.debug('output.serialize', obj)

      return uint8ArrayToString(encode(obj))
    },
    deserialize: (obj: string) => {
      logger.debug('output.deserialize', obj)

      return decode(stringToUint8Array(obj))
    },
  },
}
