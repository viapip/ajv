import path from 'node:path'

export const alg = 'ES256'
const keysDir = path.join(__dirname, './keys')

export const publicKeyPath = path.join(keysDir, 'public')
export const privateKeyPath = path.join(keysDir, 'private')
export function loadKeys() {

}

// export async function writeKeys(obj: {
//   name: string
//   privateKey: jose.KeyLike
//   publicKey: jose.KeyLike
// }) {

// }

// export async function generateKeyPair(name: string) {
//   const { privateKey, publicKey } = await jose.generateKeyPair(alg, { extractable: true })

//   // writeKeys({
//   //   name,
//   //   privateKey,
//   //   publicKey,
//   // })
// }
