<script setup lang="ts" generic="T extends { _id: string }">
import { nanoid } from 'nanoid'

import type { ComputedRef } from 'vue'

const props = withDefaults(defineProps<{
  index: number
  tag: string
  horizontal: boolean
  slotComponent?: Component
  estimateSize: number
  dataId: string
  dataKey: string
  dataGetter: (id: string) => Promise<ComputedRef<T | undefined> | ComputedRef<T | undefined>[]>
  dataComponent?: Component<{ item: T | T[], index: number }>
  extraProps?: Record<string, any>
  scopedSlots: any
  itemClass: string
}>(), {
  tag: 'div',
  horizontal: false,
  estimateSize: 100,
  dataKey: nanoid(),
})

const emit = defineEmits<{
  resize: [id: string, size: number, init: boolean]
}>()

const index = toRef(props, 'index')
const dataId = toRef(props, 'dataId')

// const test = asyncComputed(() => props.dataGetter(dataId.value))
const item: Ref<ComputedRef<T | undefined> | ComputedRef<T | undefined>[] | null> = ref(null)
watch(dataId, async () => {
  item.value = await props.dataGetter(dataId.value)
}, { immediate: true })

const rootRef = ref<HTMLElement | null>(null)
const horizontal = toRef(props, 'horizontal')
const shapeKey = computed<'width' | 'height'>(() =>
  horizontal.value ? 'width' : 'height',
)

const resizeObserver = useResizeObserver(rootRef, (entries) => {
  if (entries.length > 0)
    emit('resize', dataId.value, entries[0].contentRect[shapeKey.value], false)
})

onMounted(dispatchSizeChange)
onActivated(dispatchSizeChange)

onDeactivated(resizeObserver.stop)
onUnmounted(resizeObserver.stop)

function dispatchSizeChange() {
  if (rootRef.value) {
    const entries = rootRef.value.getClientRects()
    if (entries.length > 0)
      emit('resize', dataId.value, entries[0][shapeKey.value], true)
  }
}
</script>

<template>
  <KeepAlive :key="`${props.dataKey}-listitem_keepapive-${dataId}-${index}`">
    <Component
      :is="props.tag"
      v-if="item"
      ref="rootRef"
      :key="`${props.dataKey}-listitem_tag-${dataId}-${index}`"
    >
      <Component
        v-bind="{
          scopedSlots: props.scopedSlots,
          extraProps: props.extraProps,
          index,
          item,
        }"
        :is="props.dataComponent"
        v-if="props.dataComponent"
        :key="`${props.dataKey}-listitem_component-${dataId}-${index}`"
        :class="props.itemClass || ''"
      />
      <Component
        :is="props.slotComponent"
        v-else-if="props.slotComponent"
        :key="`${props.dataKey}-listitem_slotcomponent-${dataId}-${index}`"
        :class="props.itemClass || ''"
      />
    </Component>
    <Component
      :is="props.tag"
      v-else
      :key="`${props.dataKey}-listitem_placeholder-${dataId}-${index}`"
      :style="{
        display: 'block',
        height: `${props.estimateSize}px`,
      }"
    />
  </KeepAlive>
</template>
