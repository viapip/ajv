import consola from 'consola'
import * as jose from 'jose'

const alg = 'ES256'

const keys = await jose.generateKeyPair(alg, { extractable: true })
const keys2 = await jose.generateKeyPair(alg, { extractable: true })

consola.log('keys\n', await jose.exportPKCS8(keys.privateKey))
consola.log('keys2\n', await jose.exportPKCS8(keys2.privateKey))

const jws = await new jose.GeneralSign(
  new TextEncoder().encode('Hello, World!'),
)
  .addSignature(keys.privateKey)
  .setProtectedHeader({ alg, b64: true })
  .addSignature(keys2.privateKey)
  .setProtectedHeader({ alg, b64: true })
  .sign()

consola.log('jws', jws)

const { payload, protectedHeader } = await jose.generalVerify(
  jws,
  keys2.publicKey,
)

consola.log(protectedHeader)
consola.log(new TextDecoder().decode(payload))
