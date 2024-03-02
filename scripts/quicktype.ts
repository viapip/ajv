import { readFile, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'

import consola from 'consola'
import glob from 'fast-glob'

import { quicktypeJSONSchema } from '../src/lib/quicktype'

const logger = consola.withTag('generate')

const files = await glob('*.json', {
  cwd: 'defs',
  absolute: true,
})

await Promise.all(files.map(async (file) => {
  const typeName = basename(file, '.json')

  const jsonString = await readFile(file, 'utf8')
  const {
    lines,
    annotations,
  } = await quicktypeJSONSchema(
    'typescript',
    typeName,
    jsonString,
  )

  await writeFile(
    `src/types/${typeName}.ts`,
    [
      `/* eslint-disable eslint-comments/no-unlimited-disable */`,
      `/* eslint-disable */`,
      ...annotations,
      ...lines,
    ].join('\n'),
    {
      encoding: 'utf8',
      flag: 'w',
    },
  )

  logger.success(`Generated ${typeName}.ts`)
}))
