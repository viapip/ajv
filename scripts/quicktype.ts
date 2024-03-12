import { readFile, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'

import consola from 'consola'
import glob from 'fast-glob'
import { TypeScriptTargetLanguage } from 'quicktype-core'

import type { IQucktypeData } from '@/quicktype'
import { quicktypeMultipleJSONSchema } from '@/quicktype'

const logger = consola.withTag('generate')
const lang = new TypeScriptTargetLanguage()

const files = await glob('**/*.json', {
  cwd: 'defs',
  absolute: true,
})

const data: IQucktypeData[] = []

await Promise.all(files.map(async (file) => {
  const fileContent = await readFile(file, 'utf8')
  const schemaId = basename(file, '.json')
  data.push({
    typeName: schemaId,
    jsonString: fileContent,
  })
}))

// inputData.addInput(jsonInput)
// const filesRendered = await quicktypeMultiFile({
//   inputData,
//   lang,
//   outputFilename: 'index',
//   rendererOptions: {
//     'just-types': true,
//     'prefer-types': true,
//     'prefer-unions': true,
//     'declare-unions': true,
//   },
// })

const filesRendered = await quicktypeMultipleJSONSchema(lang, data, {
  rendererOptions: {
    'just-types': true,
    'prefer-types': true,
    'prefer-unions': true,
    'declare-unions': true,
  },
})

filesRendered.forEach(({ annotations, lines }, fileName) => {
  writeFile(
    `types/${fileName}.ts`,
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
})

logger.info('rendered', filesRendered)
