import * as jose from 'jose'

export const alg = 'ES256'

export const serverKeys = await jose.generateKeyPair(alg, { extractable: true })
export const userKeys1 = await jose.generateKeyPair(alg, { extractable: true })
export const userKeys3 = await jose.generateKeyPair(alg, { extractable: true })
