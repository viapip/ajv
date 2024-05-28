import { Buffer } from 'node:buffer'

import SecretStream from '@hyperswarm/secret-stream'
import c from 'compact-encoding'
import Protomux from 'protomux'
import UDX from 'udx-native'

const udx = new UDX()

const keys1 = SecretStream.keyPair(Buffer.alloc(32, 0).fill(0))
const keys2 = SecretStream.keyPair(Buffer.alloc(32, 0).fill(1))

const socket1 = udx.createSocket()
const socket2 = udx.createSocket()

socket1.bind(3000)
socket2.bind(4000)

const stream1 = udx.createStream(0)
const stream2 = udx.createStream(1)

stream1.connect(socket1, stream2.id, socket2.address()?.port || 4000, '127.0.0.1')
stream2.connect(socket2, stream1.id, socket1.address()?.port || 3000, '127.0.0.1')

const sstream1 = new SecretStream(true, stream1, {
  keyPair: keys1,
  remotePublicKey: keys2.publicKey,
})
const sstream2 = new SecretStream(false, stream2, {
  keyPair: keys2,
  remotePublicKey: keys1.publicKey,
})

const mux1 = new Protomux(sstream1)
const mux2 = new Protomux(sstream2)

const channel1 = mux1.createChannel({
  protocol: 'test/huest',
  id: Buffer.from('hello1'),
})

const channel2 = mux2.createChannel({
  protocol: 'test/huest',
  id: Buffer.from('hello1'),
})

const message = channel1.addMessage({
  encoding: c.json,
  onmessage(msg, session) {
    console.log(msg, session)
  },
})
channel1.open()

channel2.addMessage({
  encoding: c.json,
  onmessage(msg, session) {
    console.log(msg, session)
  },
})
channel2.open()

message.send({
  hello: 'world',
})

// stream2.on('data', (data) => {
//   console.log(data.toString())
// })

sstream2.on('data', (data) => {
  console.log(data.toString())
})

sstream2.on('end', () => {
  stream2.end()
})

sstream1.on('close', () => {
  console.log('stream1 closed')
  socket1.close()
})

sstream2.on('close', () => {
  console.log('stream2 closed')
  socket2.close()
})
