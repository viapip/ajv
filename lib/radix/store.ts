import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'

import type { IStore } from 'radix-ts'
import type { Storage } from 'unstorage'

export class StoreInMemory implements IStore {
  public storage: Storage<any>

  constructor() {
    this.storage = createStorage<any>({
      driver: fsDriver({ base: './tmp' }),
    })
  }

  async get(key: string) {
    return this.storage.getItem(key)
  }

  async set(key: string, value: any) {
    return this.storage.setItem(key, value)
  }

  async del(key: string) {
    return this.storage.removeItem(key)
  }

  toString(_pathsOnly = false) {
    return JSON.stringify(
      this.storage,
    )
  }
}
