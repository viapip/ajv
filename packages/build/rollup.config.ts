import build from './src'

export default build({
  src: './src',

  pkg: 'package.json',
  tsconfig: 'tsconfig.build.json',
  input: 'index.ts',
})
