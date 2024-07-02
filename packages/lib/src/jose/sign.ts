import { SignJWT, importJWK, jwtVerify } from 'jose'

import type { KeyPair } from './types'
import type { JWTPayload, JWTVerifyGetKey, VerifyOptions } from 'jose'

const alg = 'ES256'
const options = {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
}

export async function sign(
  keyPair: KeyPair,
  payload: JWTPayload,
) {
  const { privateKey } = keyPair
  const { kid } = privateKey

  const signKey = await importJWK(privateKey)

  return new SignJWT(payload)
    .setIssuer(options.issuer)
    .setAudience(options.audience)
    .setProtectedHeader({ alg, kid })
    .setExpirationTime('10m')
    .setIssuedAt()
    .sign(signKey)
}

export async function verify(
  jwt: string,
  keySet: JWTVerifyGetKey,
  verifyOptions?: VerifyOptions,
) {
  const { payload } = await jwtVerify(
    jwt,
    keySet,
    verifyOptions,
  )

  return payload
}
