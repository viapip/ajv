<script setup lang="ts">
// import { stringToUint8Array } from '@sozdev/share-libs/src/browser'
import { stringToUint8Array } from '@sozdev/share-libs/dist/browser'
import { Loro, decodeImportBlobMeta } from 'loro-crdt'
import { set } from 'radash'

import type { DocType } from '@sozdev/share-libs/src/browser'
import type { LoroMap } from 'loro-crdt'
import type { Difference } from 'microdiff'

const { $trpc } = useNuxtApp()
const items = ref([
  {
    changes: [],
    slot: 'test',
  },
])

// const rootDoc = ref(new Loro<{ docs: LoroMap<Record<string, Loro>> }>())
// const doc1 = ref(new Loro<{ docs: LoroMap<Record<string, DocType>> }>())
const doc = ref<Loro<Record<string, LoroMap<Record<string, DocType>>>>>(new Loro())
const doc1 = new Loro()
// const folder = rootDoc.value.getMap('docs')
// folder.set('docs', doc.value)
// const res = stringToUint8Array(await $trpc.docs.getItem.query('123'))
// // console.log(res)
// doc1.import(res)
// doc.value.import(res)
// console.log(doc1.toJson())
const docsRef = ref(doc1.getMap('docs'))
const nameRef = ref('')
const obj = ref<DocType | null>(null)
// map.subscribe(doc.value, (events) => {
//   console.log('events', events)
// })
// wrap.doc = A.load<DocType>(stringToUint8Array(resDoc))

// const computedDoc = computed(() => {
//   console.log('doc', doc.value.getMap('docs').toJson())
//   return doc.value.getMap('docs').toJson()
// })
doc.value.setPeerId('2')
$trpc.docs.onChange.subscribe(undefined, {
  onData({ event, partitial }) {
    // const decoded = A.decodeChange(value.lastChange)
    // console.log(decoded)
    // console.log(A.getAllChanges(wrap.doc))
    const blob = decodeImportBlobMeta(stringToUint8Array(partitial))

    console.log('onData', event)
    console.log('onData blob', blob)

    // doc.value.
    doc.value.checkout(doc.value.vvToFrontiers(blob.partialStartVersionVector))
    // doc.value.import(stringToUint8Array(partitial))
    // doc.value.attach()
    // console.log('peerId', doc.value.peerId)

    console.log('doc', doc.value.toJson())
    docsRef.value = doc.value.getMap('docs')
    obj.value = docsRef.value.get('123') as DocType
    nameRef.value = obj.value.name
    // console.log(docsRef.value.toJson())

    // doc1.import(stringToUint8Array(snapshot))

    // docsRef.value = doc1.getMap('docs')
    // obj.value = map.toJson() as DocType
    // computedDoc.effect.run()
    // console.log(doc.value.toJson())
    // doc.value.import(stringToUint8Array(value.))
    // doc.value = value.arg0.currentTarget
    // doc.value = applyDiffs(clone(doc.value), value.diffs)
    // const heads = A.getHeads(wrap.doc)
    // const before = A.getHeads(wrap.doc)

    // items.value[0].changes.push(value.lastChange)
    // const change = A.applyChanges(wrap.doc, [value.lastChange])
    // wrap.doc = change[0]
    // const diff = A.diff(wrap.doc, before, A.getHeads(wrap.doc))
    // A
    //   .console.log('diff', diff)
  },
})

const keys = await $trpc.docs.getKeys.query()

function formatPath(path: (string | number)[]) {
  let text = ''
  for (const p of path) {
    switch (typeof p) {
      case 'string':
        text += p
        break
      case 'number':
        text += `[${p}]`
        break
    }
    text += `.`
  }
  // console.log('formatPath:', text.slice(0, -1))

  return text.slice(0, -1)
}
function applyDiffs(doc: DocType, diffs: Difference[]) {
  for (const diff of diffs) {
    const path = formatPath(diff.path)
    switch (diff.type) {
      case 'CHANGE':
      case 'CREATE':
        doc = set(doc, path, diff.value)
        break
      case 'REMOVE':
        doc = set(doc, path, undefined)
        break
    }
  }

  return doc
}
</script>

<template>
  <div>
    <div> merge component</div>
    <div> keys:{{ keys }}</div>
    <div>doc name: {{ nameRef }}</div>
    <div>doc: {{ docsRef.toJson() }}</div>
    <!-- <UInput v-model="computedDoc.name" /> -->
    <UAccordion :items="items">
      <template #default>
        <UButton> изменения</UButton>
      </template>
      <template #test="{ item }">
        <div>
          <div v-for="i in item.changes" :key="i.hash">
            {{ i }}
          </div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>
