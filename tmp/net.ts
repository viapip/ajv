import { Buffer } from 'node:buffer'
import net from 'node:net'

import SecretStream from '@hyperswarm/secret-stream'
import { Duplex } from 'streamx'

const stream = new Duplex()
const secretStream = new SecretStream(true, stream, {
  keyPair: SecretStream.keyPair(Buffer.alloc(32, 0).fill(0)),
})

const server = net.createServer((socket) => {
  console.log('Client connected')

  // Pipe the client's data through the stream and back to the client
  // socket.on('connect', () => {
  // })

  // Handle errors on the socket
  socket.on('error', (err) => {
    console.error(`Socket error: ${err.message}`)
  })

  // Handle the 'end' event when the client disconnects
  socket.on('end', () => {
    console.log('Client disconnected')
  })
})

server.on('connection', (socket) => {
  console.log('Client connected')

  // Pipe the client's data through the stream and back to the client
  socket.pipe(secretStream).pipe(socket)
})

secretStream.on('data', (data) => {
  console.log(`Received: ${data.toString()}`)
})

server.listen(3000)
