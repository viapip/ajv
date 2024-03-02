import { readFile, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'

import consola from 'consola'
import glob from 'fast-glob'
import {
  FetchingJSONSchemaStore,
  InputData,
  JSONSchemaInput,
  jsonInputForTargetLanguage,
  quicktype,
} from 'quicktype-core'

import type {
  TargetLanguage,
} from 'quicktype-core'

const logger = consola.withTag('generate')

const schemaFiles = await glob('*.json', {
  cwd: 'defs',
  absolute: true,
})

await Promise.all(schemaFiles.map(async (file) => {
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
    `types/${typeName}.ts`,
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

export async function quicktypeJSON(
  targetLanguage: TargetLanguage,
  typeName: string,
  jsonString: string,
) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage)

  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  })

  const inputData = new InputData()
  inputData.addInput(jsonInput)

  return await quicktype({
    inputData,
    lang: targetLanguage,
  })
}

export async function quicktypeJSONSchema(
  targetLanguage: string,
  typeName: string,
  jsonSchemaString: string,
) {
  const schemaInput = new JSONSchemaInput(
    new FetchingJSONSchemaStore(),
    [],
  )

  await schemaInput.addSource({
    name: typeName,
    schema: jsonSchemaString,
  })

  const inputData = new InputData()
  inputData.addInput(schemaInput)

  return await quicktype({
    inputData,
    lang: targetLanguage,

    rendererOptions: {
      justTypes: true,
      preferTypes: true,
      preferUnions: true,
      declareUnions: true,
    },

    indentation: '  ',
    alphabetizeProperties: true,

    inferEnums: false,
    inferMaps: true,
    inferUuids: true,
    inferDateTimes: true,
    inferBooleanStrings: true,
    inferIntegerStrings: true,
  })
}
