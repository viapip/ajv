import { observable } from '@trpc/server/observable'
import consola from 'consola'
import { z } from 'zod'

import { publicProcedure, rootRouter } from '../trpc'

import * as a from '@/automerge'

const logger = consola.withTag('server')

export const docsRouter = rootRouter({
  getKeys: publicProcedure
    .query(async () => a.docs.keys()),

  getItem: publicProcedure
    .input(z.string())
    .query(async ({ input: id }) => a.getItem(id)),

  putItem: publicProcedure
    .input(z.object({
      id: z.string(),
      doc: z.object({
        name: z.string(),
        ideas: z.array(z.string()),
      }),
    }))
    .mutation(async ({ input: { id, doc } }) => {
      a.change(id, (d) => {
        d.name = doc.name
        d.ideas = doc.ideas
      })

      return a.getItem(id)
    }),

  deleteItem: publicProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      a.docs.delete(id)

      return true
    }),

  onChange: publicProcedure
    .subscription(async () => observable<{ id: string; lastChange: string }>((emit) => {
      a.onChange((change) => {
        logger.success('onChange', change)
        emit.next(change)
      })
    })),
})

export type DataRouter = typeof docsRouter
