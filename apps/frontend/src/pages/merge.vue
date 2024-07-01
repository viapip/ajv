<script setup>
const { $trpc } = useNuxtApp()
</script>

<template>
  <div class="w-full">
    <div v-if="$trpc">
      <Merge />
    </div>

    <Auth />
  </div>
</template>
