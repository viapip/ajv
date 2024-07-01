<script setup lang="ts">
const test: any = ref([])
const { $trpc } = useNuxtApp()

// $trpc.data.randomNumber.subscribe(1, {
//   onData(data: any) {
//     console.log(data);
//   }
// })

const sizes = [20, 40, 180, 77]
const data = Array.from({ length: 1000 }).map((_, i) => ({
  id: i,
  size: `${sizes[i % 4]}px`,
}))

const name = 'test'

async function add() {
  await Promise.all(data.map(async () => {
    const res = await $trpc.data.postItem.mutate({
      id: `${Math.floor(Math.random() * 1000)}`,
      schemaId: 'User',
      data: {
        status: 'active',
        date: new Date(),
        info: {
          name,
          email: `${name}@example.com`,
        },
      },
    })
    test.value.push(res)
  }))
  // console.log('res',res);
}

// const storage = useLocalStorage<{publicKey: Record<string, any>, privateKey: Record<string, any>} | null>('keys', null)

// const publicKey = computed(() => {
//   return storage.value?.publicKey
// })
</script>

<template>
  <div class="flex items-center">
    <!-- <UInput /> -->
    <!-- {{ publicKey }} -->
    <UButton class="mr-6" @click="add">
      upload
    </UButton>
    <div>{{ test.length }}</div>
  </div>
</template>
