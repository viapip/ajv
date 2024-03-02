import { TRPCError } from '@trpc/server'
import Ajv from 'ajv/dist/jtd'
import localize from 'ajv-i18n/localize/ru'
import consola from 'consola'

import { userSchema } from './schema'

const logger = consola.withTag('ajv')

export async function createAjv() {
  const ajv = new Ajv({
    jtd: true,
    meta: true,
    verbose: true,
    allErrors: true,
    messages: false,
    allowDate: true,
    addUsedSchema: true,
    schemaId: '$id',
    logger,
  })

  ajv.addSchema(userSchema, 'user')

  function validateSchema(schema: string, data: unknown) {
    const valid = ajv.validate(schema, data)

    if (!valid) {
      localize(ajv.errors)

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: ajv.errorsText(ajv.errors, { separator: '\n' }),
        cause: ajv.errors,
      })
    }
  }

  return {
    addSchema: ajv.addSchema,
    validateSchema,
  }
}
