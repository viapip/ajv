<script setup lang="ts">
import { defineProps, resolveComponent } from 'vue'

import { getWidget } from '~/utils/editor/constants'

import type { JSONSchema7 } from 'json-schema'

const props = defineProps<{ item: JSONSchema7 }>()
const emits = defineEmits(['change', 'blur', 'focus'])

const _schema = inject<JSONSchema7>('schema')

// Events
function _onChange(id: string, value: string) {
  emits('change', id, value)
}
function _onBlur(id: string, value: string) {
  emits('blur', id, value)
}
function _onFocus(_event: FocusEvent) {
}
const widget = getWidget(
  props.item?.type as string || 'string',
  props.item.format,
)
</script>

<template>
  <div>
    <div>{{ props.item }}</div>
    <component :is="resolveComponent(widget)" :item="props.item" />
  </div>
</template>
