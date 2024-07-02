import * as fs from 'node:fs'
import * as path from 'node:path'
import * as process from 'node:process'

import glob from 'fast-glob'

import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import defu from 'defu'
import { RollupOptions, defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

import type { RollupAliasOptions } from '@rollup/plugin-alias'
import type { RollupCommonJSOptions } from '@rollup/plugin-commonjs'
import type { RollupJsonOptions } from '@rollup/plugin-json'
import type { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve'
import type { Options as RollupDtsOptions } from 'rollup-plugin-dts'
import type { Options as RollupEsbuildOptions } from 'rollup-plugin-esbuild'

interface PackageJson {
  name: string
  version: string
  author: string
  license: string
  dependencies: Record<string, string>
  main: string
  module: string
  types: string

  [key: string]: any
}

export interface Options {
  cwd?: string
  src?: string
  out?: string

  pkg?: string
  tsconfig?: string
  input?: string[]

  json?: RollupJsonOptions
  alias?: RollupAliasOptions
  resolve?: RollupNodeResolveOptions
  commonjs?: RollupCommonJSOptions
  esbuild?: RollupEsbuildOptions
  dts?: RollupDtsOptions
}

function build(options?: Options) {
  const cwdDir = path.resolve(process.cwd(), options?.cwd || '.')
  const srcDir = path.resolve(cwdDir, options?.src || './src')
  const outDir = path.resolve(cwdDir, options?.out || './dist')

  const pkgFile = path.join(cwdDir, options?.pkg || 'package.json')
  const tsconfigFile = path.join(cwdDir, options?.tsconfig || 'tsconfig.json')

  const inputFiles = options?.input?.flatMap((file) =>
    glob.sync(path.resolve(srcDir, file)),
  )

  if (!inputFiles) {
    throw new Error('No input files found')
  }

  const pkg: PackageJson = JSON.parse(
    fs.readFileSync(pkgFile, { encoding: 'utf-8' }),
  )

  const author = pkg.author
  const moduleName = pkg.name.replace(/^@.*\//, '')
  const external = Object.keys(pkg.dependencies)

  const banner = `/**
  * @license
  * author: ${author}
  * ${moduleName} v${pkg.version}
  * Released under the ${pkg.license} license.
  */`

  const defaultOptions: Options = {
    cwd: cwdDir,
    src: srcDir,
    out: outDir,

    pkg: pkgFile,
    input: inputFiles,
    tsconfig: tsconfigFile,

    json: {
      preferConst: true,
      indent: '  ',
    },
    alias: {
      entries: [],
    },
    resolve: {
      preferBuiltins: true,
    },
    commonjs: {
      exclude: external,
    },
    esbuild: {
      exclude: external,
      minify: true,
      tsconfig: tsconfigFile,
    },
    dts: {
      respectExternal: true,
      tsconfig: tsconfigFile,
    },
  }

  const opts = defu(
    options,
    defaultOptions
  )

  return defineConfig(
    inputFiles.flatMap((input) => {
      console.log(`Building ${input}`)
      
      const basename = path.relative(srcDir, input).replace(/\.[^.]+$/, '')

      const rollupOptions: RollupOptions = {
        input,
        external,
        output: [
          {
            file: path.join(outDir, `cjs/${basename}.cjs`),
            sourcemap: true,
            format: 'cjs',
            banner,
          },
          {
            file: path.join(outDir, `esm/${basename}.mjs`),
            sourcemap: true,
            format: 'esm',
            banner,
          },
        ],
        plugins: [
          json(opts.json),
          alias(opts.alias),
          resolve(opts.resolve),
          commonjs(opts.commonjs),
          esbuild(opts.esbuild),
        ],
      }
      const dtsOptions: RollupOptions = {
        input,
        external,
        output: [
          {
            file: path.join(outDir, `types/${basename}.d.ts`),
            sourcemap: true,
            format: 'esm',
            banner,
          },
        ],
        plugins: [
          json(opts.json),
          alias(opts.alias),
          resolve(opts.resolve),
          dts(opts.dts),
        ],
      }

      return [
        rollupOptions,
        dtsOptions
      ]
    }),
  )
}

export default build
