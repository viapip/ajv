import build from '@regioni/build'
import wasm from '@rollup/plugin-wasm'

// import { terser } from 'rollup-plugin-terser'
// import nodePolyfills from 'rollup-plugin-node-polyfills'

export default build({
  src: './src',

  input: './index.ts',
  pkg: './package.json',
  tsconfig: './tsconfig.json',
  plugins: [
    wasm(),
    // nodePolyfills(),
    // terser()
  ],
  esbuild: {
    minify: true,
  },
  dts: {
    respectExternal: true,
  },

  resolve: {
    // modulePaths: [],
    preferBuiltins: true,
  },
  json: {
    compact: true,
  },

})
