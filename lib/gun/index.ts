import { createServer } from 'node:http'

// import './flint'

import consola from 'consola'
import GUN from 'gun'
import { P, match } from 'ts-pattern'

import type { GunSchema } from 'gun'
import type { FeatureGeoJSONPoint } from 'types/index'

// import 'gun/lib/time'
// import 'gun/lib/list'

interface IUser extends Record<string, GunSchema> {
  name: string
}

interface IGunSchema extends Record<string, GunSchema> {
  test: { data: string }
  items: { [key: string]: { text: [string] } }
  points: { [key: string]: FeatureGeoJSONPoint }
}

const logger = consola.withTag('gun')

const config = {
  port: 3000,
  alias: 'test1',
  password: 'secret123456',
}

// GUN.on('opt', function (ctx) {
//   // logger.success('GUN.on.opt', ctx)

//   // eslint-disable-next-line ts/no-invalid-this
//   this.to.next(ctx)

//   ctx.on('put', data => logger.log(
//     'GUN.on.put',
//     data.put['#'], // path
//     data.put['.'], // key
//     data.put[':'], // value
//   ))
// })

const server = createServer()
const gun = GUN<IGunSchema>({
  web: server,
  radisk: true,
})

const mesh = gun.back('opt.mesh')
logger.success('mesh', mesh)

gun.on('put', data => logger.log(
  'gun.on.put',
  data.put['#'], // path
  data.put['.'], // key
  data.put[':'], // value
))

const user = gun
  .user<IUser>()

user.on('put', data => logger.log(
  'gun.on.put',
  data.put['#'], // path
  data.put['.'], // key
  data.put[':'], // value
))

user
  .create(
    config.alias,
    config.password,
    data =>
      match(data)
        .with({ err: P.string }, (t) => {
          logger.error('user.create:', t.err)
        })
        .otherwise((t) => {
          logger.success('user.create:', t.pub)
        }),
  )

user
  .auth(
    config.alias,
    config.password,
    data =>
      match(data)
        .with({ err: P.string }, (t) => {
          logger.error('user.auth:', t.err)
        })
        .otherwise((t) => {
          logger.success('user.auth:', t.sea.epub)
        }),
  )

user
  .get('name')
  .put('Alexander')

const test = gun
  .get('test')
  .put(
    { data: 'test-put' },
    data =>
      match(data)
        .with({ err: P.string }, (t) => {
          logger.error('test.put:', t.err)
        })
        .otherwise((t) => {
          logger.success('test.put:', t.ok)
        }),
  )

const items = gun
  .get('items')

for (let i = 0; i < 10; i++) {
  items
    .put(
      { [`key-${i}`]: { text: [`value-${i}`] } },
      data =>
        match(data)
          .with({ err: P.string }, (t) => {
            logger.error('items.put:', t.err)
          })
          .otherwise((t) => {
            logger.success('items.put:', t.ok)
          }),
    )
}

server
  .on(
    'request',
    (_req, res) => {
      items
        .map()
        .once((data, key) => {
          logger.success('items.map.once:', key, data)
        })

      test
        .once((data) => {
          logger.success('test.once:', data)
          res.write(JSON.stringify(data))
          res.end()
        })
    },
  )

server
  .listen(config.port)
