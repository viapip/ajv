import * as jose from 'jose'

const alg = 'ES256'

const keys = await jose.generateKeyPair(alg, { extractable: true })
const keys2 = await jose.generateKeyPair(alg, { extractable: true })

console.log('keys\n', await jose.exportPKCS8(keys.privateKey))
console.log('keys2\n', await jose.exportPKCS8(keys2.privateKey))

const jwt = await new jose.GeneralSign(
  new TextEncoder().encode('Hello, World!'),
)
  .addSignature(keys.privateKey)
  .setProtectedHeader({ alg, b64: true })
  .addSignature(keys2.privateKey)
  .setProtectedHeader({ alg, b64: true })
  .sign()

console.log('jwt', jwt)

const { payload, protectedHeader } = await jose.generalVerify(
  jwt,
  keys2.publicKey,
)

console.log(protectedHeader)
console.log(new TextDecoder().decode(payload))
