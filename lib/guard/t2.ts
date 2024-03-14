import * as jose from 'jose'

const alg = 'ES256'
const options = {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
}

const keys = await jose.generateKeyPair(alg, { extractable: true })
const keys2 = await jose.generateKeyPair(alg, { extractable: true })
// const keys3 = await jose.generateKeyPair(alg, { extractable: true });

const jwk1 = await jose.exportJWK(keys.publicKey).then((jwk) => {
  jwk.kid = 'key1'

  return jwk
})

const jwk2 = await jose.exportJWK(keys2.publicKey).then((jwk) => {
  jwk.kid = 'key2'

  return jwk
})

// const jwk3 = await jose.exportJWK(keys3.publicKey).then((jwk) => {
//     jwk.kid = "key3";
//     return jwk;
// });

const jwks = jose.createLocalJWKSet({ keys: [jwk1, jwk2] })

console.log('keys\n', await jose.exportPKCS8(keys.privateKey))
console.log('keys2\n', await jose.exportPKCS8(keys2.privateKey))

const jwt = await new jose.SignJWT({
  foo: 'bar',
})
  .setIssuer(options.issuer)
  .setAudience(options.audience)
  .setProtectedHeader({ alg, kid: 'key1' })
  .setExpirationTime('10m')
  .setIssuedAt()
  .sign(keys.privateKey)

console.log('jwt', jwt)

const { payload, protectedHeader } = await jose
  .jwtVerify(jwt, jwks, options)

console.log(protectedHeader)
console.log(payload)
