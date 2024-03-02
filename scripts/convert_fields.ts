import fs from 'node:fs/promises'

// import consola from 'consola'
import { fork, group, keys, mapEntries } from 'radash'

export type JTDFieldType = 'string' | 'int32' | 'boolean' | 'enum'

export interface Field {
  _id: string
  mandate: number
  group: string
  info: Info
  type: 10 | 20 | 30 | 40
  validation: string
  values?: Record<string, string>
}

export interface Info {
  name: string
  group_name: string
}

// const logger = consola.withTag('convert:fields')

const fieldsTypeMap: Record<Field['type'], JTDFieldType> = {
  10: 'string',
  20: 'int32',
  30: 'boolean',
  40: 'enum',
}

const fieldsJson = await fs.readFile('./data/fields.json', 'utf8')
const fields: Field[] = JSON.parse(fieldsJson)
const fieldsByGroup = group(fields, (item) => {
  return item.group
})
const fieldsJTD = mapEntries(fieldsByGroup, (key, fields) => {
  return [key, convertFields(fields)]
})

for (const [key, value] of Object.entries(fieldsJTD)) {
  fs.writeFile(`./defs/${key}.jtd.json`, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: 'utf8',
    flag: 'w',
  })
}

function convertFields(
  fields: Field[] | undefined,
): any {
  if (!fields) {
    return
  }

  const [required, optional] = fork(fields, (field) => {
    return !field.validation.startsWith('omitempty')
  })

  const properties = required.reduce((sum, field) => {
    sum[field._id] = fieldToJTD(field)

    return sum
  }, {})

  const optionalProperties = optional.reduce((sum, field) => {
    sum[field._id] = fieldToJTD(field)

    return sum
  }, {})

  return {
    properties,
    optionalProperties: optional.length > 0
      ? optionalProperties
      : false,
  }
}

function fieldToJTD(field: Field): any {
  const type = fieldsTypeMap[field.type]

  // const metadata = {
  //   group: field.group,
  //   mandate: field.mandate,
  //   name: field.info.name,
  //   group_name: field.info.group_name,
  // }

  if (type === 'enum') {
    return {
      enum: keys(field.values || {}),
    }
  }

  return {
    type,
  }
}
