import { next as A } from '@automerge/automerge'

import type { FeatureGeoJSONPoint } from 'types/index'

interface DocType {
  ideas: Array<A.RawString>
  points: Array<FeatureGeoJSONPoint>
}

let doc1 = A.init<DocType>()

doc1 = A.change(doc1, (d) => {
  d.ideas = [
    new A.RawString('an immutable document'),
    new A.RawString('that can be changed'),
  ]
})

doc1 = A
  .change(
    doc1,
    (d) => {
      d.points = [
        {
          type: 'Point',
          properties: {},
          coordinates: [
            59.329323,
            37.867535,
          ],
        },
      ]
    },
  )

let doc2 = A.init<DocType>()
doc2 = A.merge(
  doc2,
  A.clone(doc1),
)
doc2 = A.change<DocType>(
  doc2,
  (d) => {
    d.ideas.push(new A.RawString('which records its history'))
  },
)

const heads = A.getHeads(doc1)
// Note the `A.clone` call, see the "cloning" section of this readme for
// more detail
doc1 = A.merge(
  doc1,
  A.clone(doc2),
)

doc1 = A.change(doc1, {
  message: 'change 2',
  time: new Date().getTime(),
}, (d) => {
  d.ideas[0] = new A.RawString('is immutable')
  d.ideas[1] = new A.RawString('and can be changed')
  d.ideas[2] = new A.RawString('which records its history')
})

console.log(
  'last local change',
  A.decodeChange(
    A.getLastLocalChange(doc1) || new Uint8Array(0),
  ),
)

doc1 = A
  .change(
    doc1,
    (d) => {
      d.points[0]!.coordinates![0] = 23
      d.points[0]!.coordinates![1] = 23
    },
  )

A.dump(doc1)

A
  .diff(
    doc1,
    heads,
    A.getHeads(doc1),
  )
  .forEach(c =>
    console.log('diff', JSON.stringify(
      c,
      null,
      2,
    )),
  )

A
  .getChanges(
    A.init(),
    doc1,
  )
  .forEach(c =>
    console.log('getChanges', JSON.stringify(
      A.decodeChange(c),
      null,
      2,
    )),
  )

const doc3 = A.merge(doc1, doc2)

console.log(doc3)
console.log(heads)
