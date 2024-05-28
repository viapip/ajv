import { Loro } from 'loro-crdt'

import { uint8ArrayToString } from '@/transformer'

import type { LoroEvent, LoroMap } from 'loro-crdt'

export interface DocType {
  name: string
  ideas: Array<string>
}

const root = new Loro<{ docs: LoroMap<Record<string, DocType>> }>()

const docs = root.getMap('docs')
docs.set('test', { name: '', ideas: [] })

export function getKeys() {
  return docs.keys() as string[]
}

export function getItem() {
  return uint8ArrayToString(root.exportSnapshot())
}

export function deleteItem(id: string) {
  docs.delete(id)
}

export function putItem(
  id: string,
  doc: DocType,
) {
  docs.set(id, doc)
}

export function onChange(
  listener: (event: LoroEvent) => void,
) {
  root.subscribe(listener)
}
