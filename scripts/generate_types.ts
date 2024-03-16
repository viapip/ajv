import { readFile, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'

import consola from 'consola'
import glob from 'fast-glob'
import { TypeScriptTargetLanguage } from 'quicktype-core'

import { quicktypeMultipleJSONSchema } from '@/quicktype'

import type { JSONSchemaSourceData } from 'quicktype-core'

const logger = consola.withTag('generate:types')

const files = await glob('**/*.json', {
  cwd: 'defs',
  absolute: true,
})

const data: JSONSchemaSourceData[] = []
await Promise.all(files.map(async (file) => {
  const schema = await readFile(file, 'utf8')
  const name = basename(file, '.json')
  data.push({ name, schema })
}))

const lang = new TypeScriptTargetLanguage()
const filesRendered = await quicktypeMultipleJSONSchema(lang, data, {
  outputFilename: 'index',
  rendererOptions: {
    'just-types': true,
    'prefer-types': true,
    'prefer-unions': true,
    'declare-unions': true,
  },
})

for (
  const [
    outputFilename,
    { annotations, lines },
  ] of filesRendered.entries()
) {
  logger.info(`Writing ${outputFilename}.ts...`)
  await writeFile(
    `types/${outputFilename}.ts`,
    [
      `/* eslint-disable */`,
      ...lines,
      ...annotations,
    ].join('\n'),
    {
      encoding: 'utf8',
      flag: 'w',
    },
  )
}

logger.success('Done!')
