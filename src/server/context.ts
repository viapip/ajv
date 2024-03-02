import { createAjv } from '~/server/lib/ajv'
import { queue } from '~/server/lib/queue'
import { createRedisStore } from '~/server/lib/redis'

import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone'
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws'

export type Context = Awaited<ReturnType<typeof createContext>>

const ajv = await createAjv()
const redis = await createRedisStore()

export async function createContext(
  _opts: CreateHTTPContextOptions | CreateWSSContextFnOptions,
) {
  return {
    ajv,
    redis,
    queue,
  }
}
