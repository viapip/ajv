import build from '@regioni/build'
import wasm from '@rollup/plugin-wasm'

// import { terser } from 'rollup-plugin-terser'
// import nodePolyfills from 'rollup-plugin-node-polyfills'

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
