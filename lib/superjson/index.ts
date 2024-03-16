import superjson from 'superjson'

import type { DataTransformer } from '@trpc/server'

export const transformer: DataTransformer = {
  serialize: (obj: unknown) => superjson.stringify(obj),
  deserialize: (obj: string) => superjson.parse(obj),
}
