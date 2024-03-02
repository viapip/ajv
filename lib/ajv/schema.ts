import type { JSONSchemaType } from 'ajv'
import type { Point } from 'types/Point'

export const userSchema: JSONSchemaType<{
  name: string
  age?: number
  point?: Point
}> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    age: {
      type: 'number',
      nullable: true,
    },
    point: {
      $ref: 'Point',
    },
  },
  required: ['name'],
  additionalProperties: false,
}
