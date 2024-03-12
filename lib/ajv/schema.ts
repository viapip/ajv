import type { JSONSchemaType } from 'ajv'
import type { TestUserInfo } from 'types'

export const userSchema: JSONSchemaType<{
  status: string
  info?: TestUserInfo
}> = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
    },
    info: {
      $ref: 'TestUserInfo',
    },
  },
  required: ['status'],
  additionalProperties: false,
}
