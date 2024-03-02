import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

import { TRPCError } from '@trpc/server'
import Ajv from 'ajv'
import localize from 'ajv-i18n/localize/ru'
import consola from 'consola'
import glob from 'fast-glob'

import { userSchema } from './schema'

import type { AnySchemaObject } from 'ajv'

const logger = consola.withTag('ajv')

export async function createAjv() {
  const ajv = new Ajv({
    logger,

    schemaId: '$id',

    meta: true,
    strict: 'log',
    strictTypes: 'log',
    allErrors: true,
    messages: false,
    verbose: true,
    allowDate: true,
    addUsedSchema: true,
  })

  const files = await glob('*.json', {
    cwd: 'defs',
    absolute: true,
  })

  const schemas = await Promise.all(files.map(async (file) => {
    const fileContent = await readFile(file, 'utf8')
    const schemaId = basename(file, '.json')
    const schema = JSON.parse(fileContent) as AnySchemaObject

    return { ...schema, $id: schemaId }
  }))

  ajv.addSchema(schemas)
  ajv.addSchema(userSchema, 'User')

  function validateSchema(schemaId: string, data: unknown) {
    const valid = ajv.validate(schemaId, data)

    if (!valid) {
      localize(ajv.errors)

      throw new TRPCError({
        cause: ajv.errors,
        code: 'BAD_REQUEST',
        message: ajv.errorsText(
          ajv.errors,
          {
            separator: '\n',
            dataVar: 'data',
          },
        ),
      })
    }
  }

  return {
    addSchema: ajv.addSchema,
    validateSchema,
  }
}
