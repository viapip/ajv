import { Loro } from 'loro-wasm'

import type { LoroMap, LoroTree } from 'loro-wasm'

interface DocType {
  test: string
}

const root = new Loro<{
  docs: LoroMap<Record<string, DocType>>
  tree: LoroTree<Record<string, DocType>>
}>()

const tree = root.getTree('tree')
const node = tree.createNode()
node.data.set('test', { test: '' })

console.log(tree.nodes, node)
