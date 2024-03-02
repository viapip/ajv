import { usersRouter } from './routers/users'
import { router } from './trpc'

// Merge routers together
export const appRouter = router({
  users: usersRouter,
})

export type AppRouter = typeof appRouter
