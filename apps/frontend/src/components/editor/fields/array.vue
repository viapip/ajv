<script setup lang="ts">
import { defineProps } from 'vue'

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
</script>

<template>
  <div>
    <div>Array</div>
    <div>
      {{ props.item }}
    </div>
  </div>
</template>
