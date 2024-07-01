<script setup lang="ts">
const props = defineProps({
  dataId: {
    type: String,
    required: true,
    default: '',
  },
  tag: {
    type: String,
    default: 'div',
  },
  horizontal: {
    type: Boolean,
    default: false,
  },
  estimateSize: {
    type: Number,
    default: 100,
  },
  itemClass: {
    type: String,
  },
})

const emit = defineEmits<{
  resize: [id: string, size: number, init: boolean]
}>()

const slots = useSlots()

const rootRef = ref<HTMLElement | null>(null)

const dataId = toRef(props, 'dataId')
const horizontal = toRef(props, 'horizontal')
const shapeKey = computed<'width' | 'height'>(() =>
  horizontal.value ? 'width' : 'height',
)

const resizeObserver = useResizeObserver(rootRef, (entries) => {
  emitResize(entries[0].contentRect[shapeKey.value])
})

onMounted(dispatchSizeChange)
onActivated(dispatchSizeChange)

onDeactivated(resizeObserver.stop)
onUnmounted(resizeObserver.stop)

function dispatchSizeChange() {
  if (rootRef.value) {
    const entries = rootRef.value.getClientRects()
    emitResize(entries[0][shapeKey.value], true)
  }
}

function emitResize(size: number, init = false) {
  emit('resize', dataId.value, size, init)
}
</script>

<template>
  <Component :is="slots.default" v-if="slots.default" :ref="rootRef" />
</template>
