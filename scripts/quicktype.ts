import { readFile, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'

import consola from 'consola'
import glob from 'fast-glob'
import { TypeScriptTargetLanguage } from 'quicktype-core'

import { quicktypeJSONSchema } from '@/quicktype'

const logger = consola.withTag('generate')

const lang = new TypeScriptTargetLanguage()
const files = await glob('**/*.json', {
  cwd: 'defs',
  absolute: true,
})

await Promise.all(files.map(async (file) => {
  const fileContent = await readFile(file, 'utf8')
  const schemaId = basename(file, '.json')

  const {
    lines,
    annotations,
  } = await quicktypeJSONSchema(
    lang,
    schemaId,
    fileContent,
  )

  await writeFile(
    `types/${schemaId}.ts`,
    [
      `/* eslint-disable */`,
      ...annotations,
      ...lines,
    ].join('\n'),
    {
      encoding: 'utf8',
      flag: 'w',
    },
  )

  logger.success(`${schemaId}.ts`)
}))
