<script setup lang="ts">
// import { defineProps, watchEffect } from 'vue'

// const _props = defineProps<{
//   test: string
// }>()

const _emits = defineEmits(['change', 'blur', 'focus'])

// Events
function _onChange(_event: Event) {
  // const value = event.target.value
  // emits('change', props.id, value)
  // props.onChange(value === '' ? props.options.emptyValue : value)
}
function _onBlur(_event: FocusEvent) {
  // const target = event.target as HTMLInputElement
  // emits('blur', props.id, target.value)
  // props.onBlur(props.id, target.value)
}
function _onFocus(_event: FocusEvent) {
  // props.onFocus(props.id, event.target.value)
}
</script>

<template>
  <div>
    <div>BaseInput</div>
    <UInput />
  </div>
</template>
