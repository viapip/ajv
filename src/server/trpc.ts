import { initTRPC } from '@trpc/server'

import { transformer } from '../../lib/transformer'

import type { Context } from './context'

const t = initTRPC
  .meta()
  .context<Context>()
  .create({
    transformer,
  })

export const rootRouter = t.router

export const publicProcedure = t.procedure
export const wsProcedure = t.procedure
