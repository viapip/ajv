<script setup>
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () => colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark',
})
</script>

<template>
  <ClientOnly>
    <UButton
      v-bind="$attrs"
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      :style="{}"
      @click="isDark = !isDark"
    />

    <template #fallback>
      <div v-bind="$attrs" :style="{}" />
    </template>
  </ClientOnly>
</template>
