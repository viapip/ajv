import { bitswap } from '@helia/block-brokers'
import { Identities, KeyStore, OrbitDBAccessController, PrivateKeys, PublicKeyIdentityProvider, Secp256k1PrivateKey,  createOrbitDB } from '@orbitdb/core'
import { createLogger } from '@regioni/lib/logger'
import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'
import * as jose from 'jose'
import {keys} from '@libp2p/crypto'
import {KeyPair, sign, verify} from '@regioni/lib/jose'
import { DefaultLibp2pOptions } from './config'
import * as crypto from 'node:crypto'
crypto.KeyObject
function uint8ArrayToString(array: Uint8Array): string {
  return new TextDecoder().decode(array);
}

function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

const id = 'userA'
const keysPath = './.out/keys'
const options = DefaultLibp2pOptions

const logger = createLogger()

const ipfs = await createHelia({
  libp2p: await createLibp2p({ ...options }),
  // blockstore: new LevelBlockstore(levelPath),
  blockBrokers: [bitswap()],
})

await ipfs.start()

const keystore = await KeyStore({ path: keysPath })
const identities = await Identities({ keystore, ipfs })
const algorithm = 'ES256K'
const keyPair = await keystore.createKey('userA')
const marshal = keyPair.marshal()
console.log('marshal', marshal)
const exportedKey = await keyPair.export('')
const privateJWK = await convertToJoseJWK(keyPair)
// const privateJWK = await jose.exportJWK(marshal)
logger.log('info', {privateJWK})
const privateKeyJWK = await jose.importJWK(privateJWK, algorithm)
logger.log('info', {importedJoseJWK: privateKeyJWK})

const jws = await new jose.SignJWT({payload: 'test'}).setProtectedHeader({alg: algorithm}).sign({
  type: 'KeyObject',
})
logger.log('info', {jws})

const payload = await jose.jwtVerify(jws.toString(), privateKeyJWK, {
  // algorithms: ['ES256']
})
logger.log('info', {keyPair})
logger.log('info', {privateJWK})
logger.log('info', {payload})
// jose.ver

// const provider = PublicKeyIdentityProvider({ keystore })

// const identity = await identities.createIdentity({ id, provider })

await ipfs.stop()


export async function convertToJoseJWK(keyPair: PrivateKeys): Promise<jose.JWK> {
  if (!keyPair) {
    throw new Error('No key pair provided')
  }

  const publicKey = keyPair.public
  const privateKeyBytes = keyPair.marshal()
  const publicKeyBytes = publicKey.marshal()

  // Extract x and y coordinates from the public key
  // The first byte (0x04) indicates uncompressed format, so we skip it
  
  const x = jose.base64url.encode(publicKeyBytes.slice(1, 33).toString())
  const y = jose.base64url.encode(publicKeyBytes.slice(33).toString())

  // Convert private key to base64url
  const d = jose.base64url.encode(privateKeyBytes.toString())

  return {
    kty: 'EC',
    crv: 'secp256k1',
    x,
    y,
    d
  }
}
