<script setup lang="ts">
const props = withDefaults(defineProps<{
  item: any
  index: number
}>(), {})
const item = toRef(props, 'item')
</script>

<template>
  <div class="w-full border-b flex p-3">
    <UBadge variant="solid" class="mr-3">
      {{ props.index }}
    </UBadge>
    <div>
      {{ (item.date as Date).toISOString() }}
    </div>

    <div class="ml-auto">
      {{ item.status }}
    </div>
  </div>
</template>
