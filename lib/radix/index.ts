import consola from 'consola'
import { Radix } from 'radix-ts'

import { StoreInMemory } from './store'

import type { Query } from 'radix-ts'

const logger = consola.withTag('radix')

const store = new StoreInMemory()
const radix = new Radix(store)

const containerSchema = 'schema_a'
const containerID = 'example_key_b'

await radix.set(`${containerSchema}:${containerID}:HEAD:path1`, { value: 1 })
await radix.set(`${containerSchema}:${containerID}:HEAD:path2`, { value: 1 })
await radix.set(`${containerSchema}:${containerID}:4000:path1`, { value: 2 })
await radix.set(`${containerSchema}:${containerID}:2000:path1`, { value: 2 })
await radix.set(`${containerSchema}:${containerID}:1000:path1`, { value: 2 })
await radix.set(`${containerSchema}:${containerID}:3000:path1`, { value: 5 })

// Loop through the data
const query: Query = {
  count: 4, // To retrieve four matching keys and values
  sort: -1, // Sort in descending order (1 for ascending)
  prefix: [containerSchema, containerID].join(':'), // Only return values with specified key prefix
}

// Use the loop method to iterate over keys and values
for await (const [key, delta] of radix.loop<{ value: number }>(query)) {
  const [schema, id, version, path] = key.split(':')
  logger.log({ schema, id, version, path, delta })
}

// Loop through the data
const query1: Query = {
  count: 4, // To retrieve four matching keys and values
  sort: -1, // Sort in descending order (1 for ascending)
  prefix: [containerSchema, containerID, 'HEAD'].join(':'), // Only return values with specified key prefix
}

const container: Record<string, number> = {}
for await (const [key, delta] of radix.loop<{ value: number }>(query1)) {
  const [schema, _id, _version, path] = key.split(':')
  container[path] = delta.value
}

logger.log('Container', container)
