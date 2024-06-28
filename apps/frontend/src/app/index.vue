<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
</script>

<template>
  <NuxtLayout>
    <NuxtPage :key="`${route.fullPath}_${locale}`" />
  </NuxtLayout>
</template>
