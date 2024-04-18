import { EventEmitter } from 'node:events'

import { next as A } from '@automerge/automerge'

import { uint8ArrayToString } from '@/transformer'

export interface DocType {
  name: string
  ideas: Array<string>
}

export const docs: Map<string, A.Doc<DocType>> = new Map()
const emitter = new EventEmitter()

let n = 0
export function next() {
  n += 1

  return n
}

export function getItem(id: string) {
  if (!docs.has(id)) {
    docs.set(id, A.init())
  }

  const doc = docs.get(id)!

  return uint8ArrayToString(A.save(doc))
}

export function change(
  id: string,
  changeFn: (d: DocType) => void,
): A.Doc<DocType> {
  if (!docs.has(id)) {
    docs.set(id, A.init<DocType>())
  }

  let doc = docs.get(id)!

  doc = A.change(doc, {
    message: `Change ${next()}`,
    time: new Date().getTime(),
  }, changeFn)

  docs.set(id, doc)

  const lastChange = A.getLastLocalChange(doc)
  emitter.emit('change', {
    i: id,
    lastChange: lastChange
      ? uint8ArrayToString(lastChange)
      : '',
  })

  return doc
}

export function onChange(
  listener: (data: { id: string; lastChange: string }) => void,
) {
  emitter.on('change', listener)
}
