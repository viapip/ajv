import { initTRPC } from '@trpc/server'
import consola from 'consola'

import { transformer } from '@/superjson'

import type { Context } from './context'

const logger = consola.withTag('trpc')
const t = initTRPC
  .meta()
  .context<Context>()
  .create({
    transformer,
  })

export const rootRouter = t.router

export const publicProcedure = t.procedure
export const wsProcedure = t.procedure

export const loggerMiddleware = t.middleware(async ({ next }) => {
  const start = Date.now()
  const result = await next()
  const duration = Date.now() - start

  logger.log(`Request processed in ${duration}ms`)

  // Log input and output
  if (result.ok) {
    logger.log('Success:', result)

    return result
  }
  console.error('Error:', result.error)

  return result
})
