import { dataRouter } from './routers/data'
import { rootRouter } from './trpc'

// Merge routers together
export const router = rootRouter({
  data: dataRouter,
})

export type Router = typeof router
