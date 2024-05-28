import { Buffer } from 'node:buffer'

import SecretStream from '@hyperswarm/secret-stream'
import c from 'compact-encoding'
import Protomux from 'protomux'
import UDX from 'udx-native'

const keyPair = SecretStream.keyPair(Buffer.alloc(32, 0).fill(0))

function createMux() {
  const udx = new UDX()

  const socket = udx.createSocket()

  const stream = udx.createStream(0)
  const secretStream = new SecretStream(true, stream, {
    keyPair,
  })

  const mux = new Protomux(secretStream)
  const chan = mux.createChannel({
    protocol: 'regioni/trpc',
  })

  const message = chan.addMessage({
    encoding: c.json,
    onmessage(msg, session) {
      console.log(msg, session)
    },
  })

  socket.bind(3000)
  chan.open()

  message.send({
    hello: 'world',
  })
}
