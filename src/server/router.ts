import { dataRouter } from './routers/data'
import { docsRouter } from './routers/docs'
import { rootRouter } from './trpc'

// merge routers together
export const router = rootRouter({
  data: dataRouter,
  docs: docsRouter,
})

export type Router = typeof router
