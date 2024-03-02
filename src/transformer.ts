import { decode, encode } from '@msgpack/msgpack'
import consola from 'consola'

const logger = consola.withTag('server/trpc')

function uint8ArrayToString(arr: Uint8Array) {
  let str = ''
  for (let i = 0; i < arr.length; i++) {
    str += String.fromCharCode(arr[i])
  }

  return str
}

function stringToUint8Array(str: string) {
  const arr = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i)
  }

  return arr
}

export const transformer = {
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
