import build from '@regioni/build'

export default build({
  src: './src',

  pkg: 'package.json',
  tsconfig: './tsconfig.json',
  input: ['*/index.ts'],
})
