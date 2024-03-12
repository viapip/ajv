'fast-glob'
import {
  FetchingJSONSchemaStore,
  InputData,
  JSONSchemaInput,
  quicktypeMultiFile,
} from 'quicktype-core'

import type {
  Options,
  TargetLanguage,
} from 'quicktype-core'

export interface IQucktypeData {
  typeName: string
  jsonString: string
}

export async function quicktypeMultipleJSONSchema(
  targetLanguage: string | TargetLanguage,
  data: IQucktypeData[],
  options: Omit<Partial<Options>, 'inputData'>,
) {
  const inputData = new InputData()

  const jsonInput = new JSONSchemaInput(new FetchingJSONSchemaStore())

  for (const { typeName, jsonString } of data) {
    await jsonInput.addSource({
      name: typeName,
      schema: jsonString,
    })
  }

  inputData.addInput(jsonInput)

  return quicktypeMultiFile({
    inputData,
    lang: targetLanguage,
    outputFilename: 'index',
    ...options,
  })
}
