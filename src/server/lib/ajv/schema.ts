import type { JTDSchemaType } from 'ajv/dist/jtd'

export const userSchema: JTDSchemaType<{
  name: string
  age: number
}> = {
  properties: {
    name: { type: 'string' },
    age: { type: 'int8' },
  },
}
