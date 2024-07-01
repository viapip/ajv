<script setup lang="ts">
// import { defineProps } from 'vue'

// import type { JSONSchema7 } from 'json-schema'

// interface FieldProps {
//   name: string
//   required?: boolean
//   disabled?: boolean
// }

import type { JSONSchema7 } from 'json-schema'

const props = defineProps<{
  item: JSONSchema7
}>()
// const props = defineProps()
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
</script>

<template>
  <div>
    <div>{{ props.item.description || props.item.$id }}:</div>
    <EditorTemplatesBaseInput />
  </div>
</template>
