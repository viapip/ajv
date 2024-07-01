import wasm from "@rollup/plugin-wasm";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  hooks: {
    "rollup:options": (_,options) => {
      options.plugins = Array.isArray(options.plugins) ? options.plugins : [options.plugins];
      options.plugins.push(wasm());
    }
  },
  entries: [
    {
      input: "src/index.ts",
      outDir: "dist/esm",
      builder: "rollup",

      // plugins: [wasm()],
      // format: "esm",
      // esbuild: {},
    },
    // {
    //   input: "src/index.ts",
    //   outDir: "dist/cjs",
    //   format: "cjs",
    //   ext: "cjs",
    //   declaration: false,
      
    // },
  ],
  declaration: true,
  rollup: {
    emitCJS: true,
    // output: {
      
    //   plugins: [wasm()],
    // },
  },
});
