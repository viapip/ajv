'fast-glob'
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
  lang: string | TargetLanguage,
  schemaId: string,
  jsonSchemaString: string,
) {
  const schemaInput = new JSONSchemaInput(
    new FetchingJSONSchemaStore(),
    [],
  )

  await schemaInput.addSource({
    name: schemaId,
    schema: jsonSchemaString,
  })

  const inputData = new InputData()
  inputData.addInput(schemaInput)

  return quicktype({
    lang,
    inputData,

    indentation: '  ',
    alphabetizeProperties: true,
    combineClasses: true,

    inferEnums: false,
    inferMaps: true,
    inferUuids: true,
    inferDateTimes: true,
    inferBooleanStrings: true,
    inferIntegerStrings: true,

    leadingComments: [`${schemaId} // - Не влезай, убьет!`],

    rendererOptions: {
      justTypes: true,
      preferTypes: true,
      preferUnions: true,
      declareUnions: true,
    },
  })
}
