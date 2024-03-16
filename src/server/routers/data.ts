import { observable } from '@trpc/server/observable'
import consola from 'consola'
import { z } from 'zod'

import { publicProcedure, rootRouter } from '../trpc'

import { queueEvents } from '@/bullmq/events'

import type { Document, OptionalId } from 'mongodb'

const logger = consola.withTag('server')

export const dataRouter = rootRouter({
  getAll: publicProcedure
    .query(async ({
      ctx: { redis },
    }) => redis.data.getAll()),

  getItem: publicProcedure
    .input(z.string())
    .query(async ({
      input: id,
      ctx: { redis },
    }) => redis.data.findOne(id)),

  postItem: publicProcedure
    .input(z.object({
      id: z.string(),
      schemaId: z.string(),
      data: z.unknown(),
    }))
    .mutation(async ({
      input: { schemaId, data },
      ctx: { redis, ajv, bullmq, mongodb },
    }) => {
      ajv.validateSchema(schemaId, data)
      const job = await bullmq.add(
        'appQueue',
        { message: JSON.stringify(data) },
      )

      logger.info(`Job ${job.id} added:`, JSON.stringify(data, null, 2))
      const returnvalue = await job.waitUntilFinished(queueEvents)
      logger.success(`Job ${job.id} result:`, returnvalue)

      const { insertedId } = await mongodb
        .data
        .insertOne(data as OptionalId<Document>)

      return redis
        .data
        .insertOne(insertedId.toHexString(), data)
    }),

  randomNumber: publicProcedure
    .input(z.number())
    .subscription(async ({
      input: n,
      ctx: { bullmq },
    }) => observable<{ status: number }>((emit) => {
      logger.info(`subscription: Running subscription with n = ${n}`)
      queueEvents.on('completed', async ({ jobId }) => {
        logger.info(`subscription: Job ${jobId} completed`)
        const job = await bullmq.getJob(jobId)
        if (
          job
          && job.returnvalue
          && job.returnvalue.status % n === 0
        ) {
          emit.next(job.returnvalue)
        }
      })
    })),
})

export type DataRouter = typeof dataRouter
