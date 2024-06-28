<script setup>
const { $trpc } = useNuxtApp()
</script>

<template>
  <div class="w-full">
    <div v-if="$trpc">
      <Test />
      <TestList />
    </div>

    <Auth />

    <Editor />
  </div>
</template>
