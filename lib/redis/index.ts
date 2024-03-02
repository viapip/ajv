// import consola from 'consola'
import { createClient } from 'redis'

export interface User {
  id: string
  name: string
  age: number
}

export async function createRedisStore() {
  const connection = createClient({ url: 'redis://redis:6379' })
  await connection.connect()

  function createCRUD<T>(prefix = '') {
    const formatPattern = (...args: string[]) => {
      return [prefix, ...args].join(':')
    }

    const keyExists = async (id: string) => {
      const pattern = formatPattern(id)
      const exists = await connection.exists(pattern)

      return exists === 1
    }

    const getKeys = async () => {
      const pattern = formatPattern('*')
      const keys = await connection.keys(pattern)

      return keys
    }

    const getAll = async () => {
      const userKeys = await getKeys()
      if (userKeys.length === 0) {
        return []
      }

      const items = await connection.json.mGet(userKeys, '$')

      return items.flat() as T[]
    }

    const insertOne = async (id: string, data: Omit<T, 'id'>) => {
      const pattern = formatPattern(id)

      const item = { ...data, id }
      await connection.json.set(pattern, '$', item)

      return item as T
    }

    const findOne = async (id: string) => {
      const pattern = formatPattern(id)

      const item = await connection.json.get(pattern) as T
      if (!item) {
        return
      }

      return item as T
    }
    const findMany = async (...ids: string[]) => {
      const pattern = ids.map((id) => {
        return formatPattern(id)
      })
      const items = await connection.json.mGet(pattern, '$')

      return items as T[]
    }

    const deleteOne = async (id: string) => {
      const pattern = formatPattern(id)
      await connection.del(pattern)

      return true
    }
    const deleteMany = async (...ids: string[]) => {
      const pattern = ids.map((id) => {
        return formatPattern(id)
      })

      await connection.del(pattern)

      return true
    }

    return {
      keyExists,
      getKeys,

      getAll,

      insertOne,

      findOne,
      findMany,

      deleteOne,
      deleteMany,
    }
  }

  return { users: createCRUD<User>('user') }
}
