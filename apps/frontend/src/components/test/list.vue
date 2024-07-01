<script setup lang="ts">
import TestItem from './item.vue'

const { $trpc } = useNuxtApp()
const items: any = ref([])

items.value = await $trpc.data.getAll.query()

const store = ref<Map<string, any>>(new Map())
async function itemGetter(id: string) {
  const item = store.value.get(id)

  if (!item) {
    const res = await $trpc.data.getItem.query(id)
    store.value.set(id, res)
  }

  return computed(() => {
    return store.value.get(id)
  })
}
const itemsId = computed(() => {
  const ids = items.value.map((item: any) => item._id)

  return ids
})
</script>

<template>
  <div class="w-full ">
    <div class="h-60 mt-11 border  ">
      count: {{ itemsId.length }}
      <UiVirtualList
        v-if="itemsId.length > 0"
        key="objectFields-virtuallist"
        class="h-full overflow-auto"
        :keeps="20"
        wrap-class="h-60"
        data-key="objectFields-virtuallist"
        :page-mode="false"
        :data-ids="itemsId"
        item-class=""
        :data-getter="itemGetter"
        :data-component="TestItem"
        :estimate-size="76"
      />
    </div>
  </div>
</template>
