import build from '@regioni/build'
import wasm from '@rollup/plugin-wasm'

// import { terser } from 'rollup-plugin-terser'
// import nodePolyfills from 'rollup-plugin-node-polyfills'

export default build({
  src: './src',

  input: './index.ts',
  pkg: './package.json',
  tsconfig: './tsconfig.build.json',
  plugins: [
    wasm(),
    // nodePolyfills(),
    // terser()
  ],
  esbuild: {
    minify: true,
  },

  resolve: {
    modulePaths: [],
    preferBuiltins: false,
  },
  json: {
    compact: true,
  },

})
