import { readFile, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'

import consola from 'consola'
import glob from 'fast-glob'
import { FetchingJSONSchemaStore, InputData, JSONSchemaInput, TypeScriptTargetLanguage, quicktypeMultiFile } from 'quicktype-core'

const logger = consola.withTag('generate')
const lang = new TypeScriptTargetLanguage()

const files = await glob('**/*.json', {
  cwd: 'defs',
  absolute: true,
})

const inputData = new InputData()

const jsonInput = new JSONSchemaInput(new FetchingJSONSchemaStore())

await Promise.all(files.map(async (file) => {
  const fileContent = await readFile(file, 'utf8')
  const schemaId = basename(file, '.json')

  await jsonInput.addSource({
    name: schemaId,
    schema: fileContent,
  })
}))

inputData.addInput(jsonInput)

const filesRendered = await quicktypeMultiFile({
  inputData,
  lang,
  outputFilename: 'index',

  rendererOptions: {
    justTypes: true,
    preferTypes: true,
    preferUnions: true,
    declareUnions: true,
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
