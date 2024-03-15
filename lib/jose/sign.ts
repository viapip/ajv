import * as jose from 'jose'

import { keys1Private } from './keys'

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
