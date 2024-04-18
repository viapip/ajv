import { EventEmitter } from 'node:events'

import { nanoid } from 'nanoid'

interface CRDTNode {
  id: string
  value: string
  children: CRDTNode[]
  version: Map<string, number>
}

export class CRDT {
  root: CRDTNode
  eventEmitter: EventEmitter

  constructor() {
    this.eventEmitter = new EventEmitter()
    this.root = {
      id: 'root',
      value: 'Root',
      children: [],
      version: new Map(),
    }
  }

  insert(parentId: string, value: any) {
    const parentNode = parentId === null
      ? this.root
      : this.findNodeById(this.root, parentId)
    if (!parentNode) {
      return null
    }

    const newNode: CRDTNode = {
      id: nanoid(),
      value,
      children: [],
      version: new Map(parentNode.version),
    }

    parentNode.children.push(newNode)
    this.eventEmitter.emit('insert', newNode)
    newNode.version.set(newNode.id, (newNode.version.get(newNode.id) || 0) + 1)

    return newNode
  }

  deleteNode(id: string) {
    const parent = this.findParent(this.root, id)
    if (!parent) {
      return null
    }

    const index = parent.children.findIndex(child => child.id === id)
    if (index !== -1) {
      parent.children.splice(index, 1)
      this.eventEmitter.emit('delete', id)
    }

    parent.version.set(id, (parent.version.get(id) || 0) + 1)

    return parent
  }

  moveNode(id: string, newParentId: string | null) {
    const toMove = this.findNodeById(this.root, id)
    if (!toMove) {
      return
    }

    const oldParent = this.findParent(this.root, id)
    if (oldParent) {
      oldParent.children = oldParent.children.filter(child => child.id !== id)
      this.eventEmitter.emit('move', { id, oldParentId: oldParent.id })
    }

    const newParent = newParentId === null
      ? this.root
      : this.findNodeById(this.root, newParentId)
    if (newParent) {
      newParent.children.push(toMove)
      this.eventEmitter.emit('move', { id, newParentId: newParent.id })
    }

    this.root.version.set(id, (this.root.version.get(id) || 0) + 1)
  }

  findNodeById(node: CRDTNode, id: string): CRDTNode | null {
    if (node.id === id) {
      return node
    }
    for (const child of node.children) {
      const found = this.findNodeById(child, id)
      if (found) {
        return found
      }
    }

    return null
  }

  findParent(node: CRDTNode, id: string, parent: CRDTNode | null = null): CRDTNode | null {
    if (node.id === id) {
      return parent
    }
    for (const child of node.children) {
      const found = this.findParent(child, id, node)
      if (found) {
        return found
      }
    }

    return null
  }

  mergeReplicas(node1: CRDTNode, node2: CRDTNode): CRDTNode {
    const mergedVersion = new Map([...node1.version, ...node2.version])
    const mergedChildren = []
    const children1 = new Map(node1.children.map(child => [child.id, child]))
    const children2 = new Map(node2.children.map(child => [child.id, child]))

    for (const [id, child1] of children1) {
      if (children2.has(id)) {
        mergedChildren.push(this.mergeReplicas(child1, children2.get(id)!))
        children2.delete(id)
      }
      else {
        mergedChildren.push(child1)
      }
    }

    for (const child2 of children2.values()) {
      mergedChildren.push(child2)
    }

    return {
      id: node1.id,
      value: node1.value,
      children: mergedChildren,
      version: mergedVersion,
    }
  }

  onInsert(listener: (node: CRDTNode) => void) {
    this.eventEmitter.on('insert', listener)
  }

  onDelete(listener: (id: string) => void) {
    this.eventEmitter.on('delete', listener)
  }

  onMove(listener: ({ id, oldParentId, newParentId }: { id: string; oldParentId?: string; newParentId?: string }) => void) {
    this.eventEmitter.on('move', listener)
  }
}

const crdt = new CRDT()

crdt.onInsert(node => console.log('insert', JSON.stringify(node, null, 2)))
crdt.onDelete(id => console.log('delete', JSON.stringify(id, null, 2)))
crdt.onMove(info => console.log('move', JSON.stringify(info, null, 2)))

crdt.insert('root', 'Root')
crdt.insert('root', 'Sub 1')
crdt.insert('root', 'Sub 2')
crdt.insert('Sub 1', 'Sub 1.1')
crdt.insert('Sub 2', 'Sub 2.1')
crdt.moveNode('Sub 2.1', 'Sub 1')
crdt.deleteNode('Sub 1.1')

console.log(
  'Root:',
  JSON.stringify(crdt.root, null, 2),
)

const crdt2 = new CRDT()

crdt2.insert('root', 'Root 2')
crdt2.insert('root', 'Sub 1.2')
crdt2.insert('root', 'Sub 2.2')
crdt2.insert('Sub 1.2', 'Sub 1.1.2')
crdt2.insert('Sub 2.2', 'Sub 2.1.2')

console.log(
  'Merged root:',
  JSON.stringify(crdt.mergeReplicas(crdt.root, crdt2.root), null, 2),
)
