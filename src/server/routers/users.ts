import { observable } from '@trpc/server/observable'
import consola from 'consola'
import { z } from 'zod'

import { publicProcedure, rootRouter } from '../trpc'

import { queueEvents } from '~/lib/bullmq/events'

const logger = consola.withTag('server')

export const dataRouter = rootRouter({
  getAll: publicProcedure
    .query(async ({
      ctx: { redis },
    }) => {
      const users = await redis.users.getAll()

      return users
    }),

  getItem: publicProcedure
    .input(z.string())
    .query(async ({
      input: id,
      ctx: { redis },
    }) => {
      const item = await redis.users.findOne(id)

      return item
    }),

  postItem: publicProcedure
    .input(z.object({
      id: z.string(),
      schemaId: z.string(),
      data: z.any(),
    }))
    .mutation(async ({
      input: { id, schemaId, data },
      ctx: { redis, ajv, bullmq },
    }) => {
      ajv.validateSchema(schemaId, data)

      const job = await bullmq.add(
        'appQueue',
        { message: data.name },
      )

      logger.info(`Job ${job.id} added:`, JSON.stringify(data, null, 2))
      const result = await job.waitUntilFinished(queueEvents)
      logger.success(`Job ${job.id} result:`, JSON.stringify(result, null, 2))

      const item = await redis.users.insertOne(id, data)

      return {
        ...item,
        id,
      }
    }),

  randomNumber: publicProcedure
    .input(z.number())
    .subscription(async ({
      input: n,
      ctx: { bullmq },
    }) => {
      return observable<{ status: number }>((emit) => {
        queueEvents.on('completed', async ({ jobId }) => {
          const job = await bullmq.getJob(jobId)

          if (
            job
            && job.returnvalue
            && job.returnvalue.status % n === 0
          ) {
            emit.next(job.returnvalue)
          }
        })
      })
    }),
})

export type DataRouter = typeof dataRouter
