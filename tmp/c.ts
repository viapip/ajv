// Import the net module to create a client
import { Buffer } from 'node:buffer'
import net from 'node:net'

import SecretStream from '@hyperswarm/secret-stream'
import { Duplex } from 'streamx'

// Connect to the server
const stream = new Duplex()
const secretStream = new SecretStream(false, stream, {
  keyPair: SecretStream.keyPair(Buffer.alloc(32, 0).fill(0)),
})

const client = net.createConnection({ port: 3000 }, () => {
  // Listen for data from the server
  client.on('data', (data) => {
    console.log(`Received: ${data.toString()}`)
    // Close the connection once done
    client.end()
  })

  // Handle the 'end' event when the server closes the connection
  client.on('end', () => {
    console.log('Disconnected from server')
  })

  // Handle errors on the client
  client.on('error', (err) => {
    console.error(`Client error: ${err.message}`)
  })
})

client.on('connect', () => {
  console.log('Connected to server')

  secretStream.pipe(client).pipe(secretStream)
  secretStream.write(Buffer.from('hello'))
})
