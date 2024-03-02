import { sleep } from '@antfu/utils'
import { Worker } from 'bullmq'
import consola from 'consola'

const logger = consola.withTag('worker')

const worker = new Worker<
{ message: string },
{ status: number }
>('appQueue',
  async (job) => {
    logger.log('Job received', job.data)

    if (job.data.message === 'error') {
      throw new Error(`User name should not be ${job.data.message}`)
    }

    if (Number.parseInt(job.id || '0') % 3 === 0) {
      await sleep(1000)
    }

    return { status: 200 + Math.floor(Math.random() * 100) }
  },
  {
    concurrency: 10,
    connection: {
      host: 'redis',
      port: 6379,
    },
  },
)

worker.on('completed', (job) => {
  logger.log('Job completed', job?.returnvalue)
})

worker.on('failed', (job, err) => {
  logger.error('Job failed', job?.data, err)
})
