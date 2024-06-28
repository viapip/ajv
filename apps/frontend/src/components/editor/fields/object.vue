<script setup lang="ts">
import { defineProps } from 'vue'

import { getMapSchema, mapFields } from '~/utils/editor/constants'

import type { JSONSchema7 } from 'json-schema'

const props = defineProps<{ item: JSONSchema7 }>()
const emits = defineEmits(['change', 'blur', 'focus'])

// Events
function _onChange(id: string, value: string) {
  emits('change', id, value)
}
function _onBlur(id: string, value: string) {
  emits('blur', id, value)
}
function _onFocus(_event: FocusEvent) {
}
const mapRef = getMapSchema(props.item)
// const mapRef = ref(new Map<string, Omit<JSONSchema7, 'type'> & { type: JSONSchema7TypeName }>())
// traverse(props.item, (
//   s,
//   key,
// ) => {
//   if (key && !withSpecialChilds.includes(key))
//     mapRef.value.set(key, { $id: key, ...s })
// })
</script>

<template>
  <div>
    <div>Object</div>
    <div>
      <div v-for="[key, value] of mapRef.entries()" :key="key">
        <component
          :is="resolveComponent(mapFields[value.type])"
          :schema="props.item"
          :item="value"
        />
      </div>
    </div>
  </div>
</template>
