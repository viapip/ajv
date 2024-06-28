<script setup lang="ts">
import { resolveComponent } from 'vue'

import { getMapSchema, mapFields } from '~/utils/editor/constants'

import type { JSONSchema7 } from 'json-schema'

const props = withDefaults(defineProps<{
  schema: JSONSchema7
}>(), {})

const mapRef = getMapSchema(props.schema)

// const mapRef = ref(new Map<string, Omit<JSONSchema7, 'type'> & { type: JSONSchema7TypeName }>())
// traverse(props.schema, (
//   s,
//   key,
// ) => {
//   if (key && !withSpecialChilds.includes(key))
//     mapRef.value.set(key, { $id: key, ...s })
// })

provide('schema', props.schema)
</script>

<template>
  <div>
    <div class="border py-8">
      {{ mapRef }}
    </div>

    <div>
      <div v-for="[key, value] of mapRef.entries()" :key="key">
        <component
          :is="resolveComponent(mapFields[value.type])"
          :schema="props.schema"
          :item="value"
        />
      </div>
    </div>
  </div>
</template>
