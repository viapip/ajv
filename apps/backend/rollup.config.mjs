import build from '@regioni/build'

export default build({
  src: './src',

  input: ['./index.ts'],
  pkg: './package.json',
  tsconfig: './tsconfig.build.json',
  resolve: {
    preferBuiltins: true,
    modulesOnly: true,
    modulePaths: [
      'node_modules',
      '../../packages'
    ],
  }
})
