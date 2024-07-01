import * as fs from 'node:fs'
import * as path from 'node:path'
import * as process from 'node:process'

import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import defu from 'defu'
import { InputPluginOption, defineConfig } from 'rollup'
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

  [key: string]: any
}

export interface Options {
  cwd?: string
  src?: string

  pkg?: string
  tsconfig?: string
  input?: string

  json?: RollupJsonOptions
  alias?: RollupAliasOptions
  resolve?: RollupNodeResolveOptions
  commonjs?: RollupCommonJSOptions
  esbuild?: RollupEsbuildOptions
  dts?: RollupDtsOptions
  plugins?: InputPluginOption[]
}

function build(options?: Options) {
  const cwdDir = path.resolve(process.cwd(), options?.cwd || '.')
  const srcDir = path.resolve(cwdDir, options?.src || './src')

  const pkgFile = path.join(cwdDir, options?.pkg || 'package.json')
  const tsconfigFile = path.join(cwdDir, options?.tsconfig || 'tsconfig.json')
  const inputFile = path.resolve(srcDir, options?.input || 'index.ts')

  const pkg: PackageJson = JSON.parse(
    fs.readFileSync(
      pkgFile,
      { encoding: 'utf-8' },
    ),
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

    pkg: pkgFile,
    input: inputFile,
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
      // exclude: external,
    },
    esbuild: {
      // include: external,
      // exclude: external,
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
    defaultOptions,
  )

  return defineConfig([
    {
      input: inputFile,
      external,
      output: [
        {
          file: pkg.main,
          sourcemap: true,
          format: 'cjs',
          banner,
        },
        {
          file: pkg.module,
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
        ...(opts.plugins || [])
      ],
    },
    {
      input: inputFile,
      external,
      output: [
        {
          file: pkg.types,
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
    },
  ])
}

export default build
