import { writeFile } from 'node:fs/promises'

import consola from 'consola'
import * as jose from 'jose'

const logger = consola.withTag('generate:keys')

const alg = 'ES256'

const keys1 = await jose.generateKeyPair(alg, { extractable: true })
const keys2 = await jose.generateKeyPair(alg, { extractable: true })

const jwk1 = {
  publicKey: await jose.exportJWK(keys1.publicKey).then(addKid('key1')),
  privateKey: await jose.exportJWK(keys1.privateKey).then(addKid('key1')),
}

const jwk2 = {
  publicKey: await jose.exportJWK(keys2.publicKey).then(addKid('key2')),
  privateKey: await jose.exportJWK(keys2.privateKey).then(addKid('key2')),
}

await writeFile(
  `keys/key1.jwk`,
  JSON.stringify(jwk1, null, 2),
)

await writeFile(
  `keys/key2.jwk`,
  JSON.stringify(jwk2, null, 2),
)

function addKid(kid: string) {
  return (jwk: jose.JWK) => {
    jwk.kid = kid

    return jwk
  }
}

logger.success('Done!')
