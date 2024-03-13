import * as jose from 'jose'

const alg = 'ES256'
// const options = {
//     issuer: "urn:example:issuer",
//     audience: "urn:example:audience",
// };
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

export const jwks = jose.createLocalJWKSet({ keys: [jwk1, jwk2] })
