import { observable } from '@trpc/server/observable'
import consola from 'consola'
import { z } from 'zod'

import { publicProcedure, router } from '../trpc'

import { queueEvents } from '~/server/lib/queue/events'

const logger = consola.withTag('server')

export const usersRouter = router({
  userList: publicProcedure
    .query(async ({ ctx: { redis } }) => {
      const users = await redis.users.getAll()

      return users
    }),

  userById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx: { redis } }) => {
      const user = await redis.users.findOne(input)

      return user
    }),

  userCreate: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      age: z.number(),
    }))
    .mutation(async ({ input, ctx: { redis, ajv, queue } }) => {
      const { id, ...data } = input

      ajv.validateSchema('user', data)
      const user = await redis.users.insertOne(id, data)

      const job = await queue.add('appQueue', { message: input.name })
      logger.log('Job added', job.id)
      const result = await job.waitUntilFinished(queueEvents)
      logger.log('Job result', result)

      return {
        ...user,
        id,
      }
    }),

  randomNumber: publicProcedure
    .input(z.number())
    .subscription(async ({ input, ctx: { queue } }) => {
      return observable<{ status: number }>((emit) => {
        queueEvents.on('completed', async ({ jobId }) => {
          const job = await queue.getJob(jobId)
          if (!job) {
            return
          }

          const { returnvalue } = job
          if (returnvalue.status % input === 0) {
            emit.next(returnvalue)
          }
        })
      })
    }),
})

export type UsersRouter = typeof usersRouter
