import { StorageSerializers, useStorage } from '@vueuse/core'
import { createRemoteJWKSet } from 'jose'

import type { IJoseVerify, KeyPair } from '@sozdev/share-libs/dist/jose'

const privateKey = useStorage<KeyPair | null>('keyPair', null, undefined, {
  serializer: StorageSerializers.object,
})

export function useJose() {
  return { privateKey, getJoseVerify }
}

async function getJoseVerify(): Promise<IJoseVerify | undefined> {
  // const keys1 = {
  //   publicKey: {
  //     kty: 'EC',
  //     x: 'D8qVLV7UckTvFFMB2dRumgO1hb-VctMkcdCfLWLaFvQ',
  //     y: 'pKHQOfL0K8W6FZipThjF9XYuXrciOQeQE4ei55vSXes',
  //     crv: 'P-256',
  //     kid: 'key1',
  //   },
  //   privateKey: {
  //     kty: 'EC',
  //     x: 'D8qVLV7UckTvFFMB2dRumgO1hb-VctMkcdCfLWLaFvQ',
  //     y: 'pKHQOfL0K8W6FZipThjF9XYuXrciOQeQE4ei55vSXes',
  //     crv: 'P-256',
  //     d: 'CGUOSodDIy0tqTpgDxH0j4ReoMA9tzeMXUVmZ61G0Y0',
  //     kid: 'key1',
  //   },
  // } as KeyPair

  // const keys2 = {
  //   publicKey: {
  //     kty: 'EC',
  //     x: '8a8o_RUGD1_piE5ouA9ZyHI-4FHIZEZgTO6bW5MORYQ',
  //     y: 'EVyoFgTSSyymg1pAStH42OpQezzOMM12kVCS6KHpm-I',
  //     crv: 'P-256',
  //     kid: 'key2',
  //   },
  //   privateKey: {
  //     kty: 'EC',
  //     x: '8a8o_RUGD1_piE5ouA9ZyHI-4FHIZEZgTO6bW5MORYQ',
  //     y: 'EVyoFgTSSyymg1pAStH42OpQezzOMM12kVCS6KHpm-I',
  //     crv: 'P-256',
  //     d: 'KUiphkKbdmzYT_wnn0LFdfGXI0EFgRTV2sZEI1XRH8g',
  //     kid: 'key2',
  //   },
  // } as KeyPair

  // const publicKey = await importJWK(keys1.publicKey, 'ES256')

  // const jwks = createLocalJWKSet({
  //   keys: [keys1.publicKey],
  // })
  // console.log(privateKey.value)

  if (!privateKey.value) {
    // throw new Error('Private key not found')
    return
  }
  const test = createRemoteJWKSet(new URL('http://localhost:4000/api/jwks'))

  return {
    jwks: test,
    key: privateKey.value,
  }
}
