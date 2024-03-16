import * as jose from 'jose'

import type { KeyPair } from './types'

const alg = 'ES256'
const options = {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
}

export async function sign(
  keyPair: KeyPair,
  payload: jose.JWTPayload,
) {
  const { privateKey } = keyPair
  const keys1Private = await jose.importJWK(privateKey)

  return new jose.SignJWT(payload)
    .setIssuer(options.issuer)
    .setAudience(options.audience)
    .setProtectedHeader({
      alg,
      kid: 'key1',
    })
    .setExpirationTime('10m')
    .setIssuedAt()
    .sign(keys1Private)
}

export async function verify(
  jwt: string,
  keySet: jose.JWTVerifyGetKey,
  verifyOptions?: jose.VerifyOptions,
) {
  const { payload } = await jose.jwtVerify(
    jwt,
    keySet,
    verifyOptions,
  )

  return payload
}
