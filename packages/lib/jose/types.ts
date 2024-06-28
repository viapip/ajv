import type * as jose from 'jose'

export type KeyPair = jose.GenerateKeyPairResult<
  jose.KeyLike & jose.JWK
>
