export default eventHandler((_ctx) => {
  const jwks = {
    keys: [
      {
        kty: 'EC',
        x: '8a8o_RUGD1_piE5ouA9ZyHI-4FHIZEZgTO6bW5MORYQ',
        y: 'EVyoFgTSSyymg1pAStH42OpQezzOMM12kVCS6KHpm-I',
        crv: 'P-256',
        kid: 'key2',
      },
      {
        kty: 'EC',
        x: 'D8qVLV7UckTvFFMB2dRumgO1hb-VctMkcdCfLWLaFvQ',
        y: 'pKHQOfL0K8W6FZipThjF9XYuXrciOQeQE4ei55vSXes',
        crv: 'P-256',
        kid: 'key1',
      },
    ],
  }

  // const jwks = {
  //   "keys": [
  //     {
  //       "use": "sig",
  //       "n": "y48N6JB-AKq1-Rv4SkwBADU-hp4zXHU-NcCUwxD-aS9vr4EoT9qrjoJ-YmkaEpq9Bmu1yXZZK_h_9QS3xEsO8Rc_WSvIQCJtIaDQz8hxk4lUjUQjMB4Zf9vdTmf8KdktI9tCYCbuSbLC6TegjDM9kbl9CNs3m9wSVeO_5JXJQC0Jr-Oj7Gz9stXm0Co3f7RCxrD08kLelXaAglrd5TeGjZMyViC4cw1gPaj0Cj6knDn8UlzR_WuBpzs_ies5BrbzX-yht0WfnhXpdpiGNMbpKQD04MmPdMCYq8ENF7q5_Ok7dPsVj1vHA6vFGnf7qE3smD157szsnzn0NeXIbRMnuQ",
  //       "kid": "adf5e710edfebecbefa9a61495654d03c0b8edf8",
  //       "e": "AQAB",
  //       "kty": "RSA",
  //       "alg": "RS256"
  //     },
  //     {
  //       "alg": "RS256",
  //       "use": "sig",
  //       "e": "AQAB",
  //       "n": "uhWRpJ3PNZaiBmq3P91A6QB0b28LeQvV-HI0TAEcN5nffQPm94w-hY2S6mThb7xXLCGHcP3bhpWl31giZJFlvzHe6db-TsPl8HSLgLIjMbMT8iYWqZPa2eodijEJrkO6SPex5jHLzSwGsoRdSfW8hFeTFQk8xtPXm7GlEEo9mFEKUAaArT9acdE8h53VR7ZkJkipiLCtx0rhySA2W4rEAcinLG3ApG709pOw6sVjA2IAQmZVYrfQ7curmFqKWL_F534kDhQJL2hMdrubhHcqCxetyi_U7WDWDkYCJ_CetjDsI0yfwB2sR01vn6LuDDo6ho8pWJcHOOvXYUnSMFAlew",
  //       "kid": "934a5816468b95703953d14e9f15df5d09a401e4",
  //       "kty": "RSA"
  //     },
  //     {
  //       "alg": "RS256",
  //       "kid": "09bcf8028e06537d4d3ae4d84f5c5babcf2c0f0a",
  //       "n": "vdtZ3cfuh44JlWkJRu-3yddVp58zxSHwsWiW_jpaXgpebo0an7qY2IEs3D7kC186Bwi0T7Km9mUcDbxod89IbtZuQQuhxlgaXB-qX9GokNLdqg69rUaealXGrCdKOQ-rOBlNNGn3M4KywEC98KyQAKXe7prs7yGqI_434rrULaE7ZFmLAzsYNoZ_8l53SGDiRaUrZkhxXOEhlv1nolgYGIH2lkhEZ5BlU53BfzwjO-bLeMwxJIZxSIOy8EBIMLP7eVu6AIkAr9MaDPJqeF7n7Cn8yv_qmy51bV-INRS-HKRVriSoUxhQQTbvDYYvJzHGYu_ciJ4oRYKkDEwxXztUew",
  //       "kty": "RSA",
  //       "e": "AQAB",
  //       "use": "sig"
  //     }
  //   ]
  // }
  return jwks
})
