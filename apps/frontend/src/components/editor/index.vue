<script setup lang="ts">
import type { JSONSchema7 } from 'json-schema'

const schema: JSONSchema7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    status: {
      type: 'string',
      description: 'Статус',
    },
    date: {
      type: 'string',
      format: 'date-time',
      description: 'Дата',
    },
    option: {
      type: 'number',
      description: 'Доп опция',
    },
    test: {
      type: 'array',
      minItems: 2,
      items: {
        type: ['string', 'number'],
      },
    },
    info: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Почта',
          format: 'email',
        },
        age: {
          description: 'Возраст',
          type: 'number',
        },
      },
    },
  },
  required: ['status'],
  additionalProperties: false,
}
</script>

<template>
  <div class="flex mt-10 flex-col items-start">
    <div class="text-3xl font-bold">
      Editor
    </div>
    <EditorForm :schema="schema" />
  </div>
</template>
