<script setup lang="ts" generic="T extends { _id: string }">
import { range } from '@antfu/utils'
import { nanoid } from 'nanoid'

import type { VirtualRange } from '~/utils/virtual'

import type { ComputedRef } from 'vue'

import { Simplebar } from '#components'

const props = withDefaults(defineProps<{
  dataIds: string[]
  dataGetter: (id: string) => Promise<ComputedRef<T | undefined> | ComputedRef<T | undefined>[]>
  dataComponent?: Component<{ item: T | T[], index: number }>
  dataKey: string
  dataCursor?: number
  keeps?: number
  extraProps?: Record<string, any>
  estimateSize?: number
  direction?: 'vertical' | 'horizontal'
  start?: number
  offset?: number
  topThreshold?: number
  bottomThreshold?: number
  pageMode?: boolean
  rootTag?: string
  wrapTag?: string
  wrapClass?: string | string[]
  wrapStyle?: Record<string, any>
  itemWrapTag?: string
  itemTag?: string
  itemClass?: string | string[]
  itemClassAdd?: (i: number) => string
  itemStyle?: Record<string, any>
  headerTag?: string
  headerClass?: string
  headerStyle?: Record<string, any>
  footerTag?: string
  footerClass?: string
  footerStyle?: Record<string, any>
  itemScopedSlots?: Record<string, any>
}>(), {
  dataKey: nanoid(),
  dataCursor: 0,
  keeps: 30,
  estimateSize: 100,
  direction: 'vertical', // the other value is horizontal
  start: 0,
  offset: 0,
  topThreshold: 0,
  bottomThreshold: 0,
  pageMode: false,
  rootTag: 'div',
  wrapTag: 'div',
  itemWrapTag: 'div',
  itemTag: 'div',
  headerTag: 'div',
  footerTag: 'div',
})

const emit = defineEmits<{
  scroll: [evt: UIEvent, r: VirtualRange]
  resized: [id: string, size: number]
  totop: []
  tobottom: []
  itemHover: [n: number]
  itemClick: [n: number]
}>()

const slots = useSlots()

const rootRef = ref<InstanceType<typeof Simplebar> | null>(null)
const scrollRef = ref<HTMLElement | null>(null)

const shepherdRef = ref<HTMLElement | null>(null)

const direction = toRef(props, 'direction')
const dataIds = toRef(props, 'dataIds')

const isHorizontal = computed(() => direction.value === 'horizontal')

const offsetSizeKey = computed<'scrollLeft' | 'scrollTop'>(() => {
  return isHorizontal.value ? 'scrollLeft' : 'scrollTop'
})
const clientSizeKey = computed<'clientWidth' | 'clientHeight'>(() => {
  return isHorizontal.value ? 'clientWidth' : 'clientHeight'
})
const scrollSizeKey = computed<'scrollWidth' | 'scrollHeight'>(() => {
  return isHorizontal.value ? 'scrollWidth' : 'scrollHeight'
})

const wrapperStyle = ref<Record<string, any>>({})
const vr = ref<[number, number]>([
  Math.max(props.start, 0),
  Math.min(props.start + props.keeps, dataIds.value.length),
])

const v = new Virtual(
  {
    slotHeaderSize: 0,
    slotFooterSize: 0,
    keeps: props.keeps,
    estimateSize: props.estimateSize,
    buffer: Math.round(props.keeps / 3),
    uniqueIds: dataIds.value.slice(),
  },
  onRangeChanged,
)

defineExpose({
  rootRef,

  scrollToIndex,
  scrollToOffset,
  scrollToBottom,

  v,
})

onMounted(() => {
  // in page mode we bind scroll event to document
  if (props.pageMode) {
    updatePageModeFront()
    document.addEventListener('scroll', onScroll, {
      passive: false,
    })

    return
  }

  scrollRef.value = rootRef.value!.$refs.scrollRef as HTMLElement
})

onUnmounted(() => {
  if (props.pageMode)
    document.removeEventListener('scroll', onScroll)
})

// set back offset when awake from keep-alive
onActivated(() => {
  if (props.pageMode) {
    updatePageModeFront()

    document.addEventListener('scroll', onScroll, {
      passive: false,
    })
  }
})

onDeactivated(() => {
  if (props.pageMode)
    document.removeEventListener('scroll', onScroll)
})

watch(
  () => dataIds.value,
  (dataIds) => {
    v.updateParam('uniqueIds', dataIds.slice())
    v.handleDataSourcesChange()

    // const offset = getOffsetSize()
    // scrollToOffset(offset + 1)
  },
)
watch(
  () => props.keeps,
  (keeps) => {
    v.updateParam('keeps', keeps)
    v.handleSlotSizeChange()
  },
)
watch(
  () => props.start,
  scrollToIndex,
)
watch(
  () => props.offset,
  scrollToOffset,
)

function onScroll(evt: Event) {
  const target = evt.target as HTMLElement
  const offsetSize = target[offsetSizeKey.value]

  const clientSize = target[clientSizeKey.value]
  const scrollSize = target[scrollSizeKey.value]

  // iOS scroll-spring-back behavior will make direction mistake
  if (
    offsetSize < 0
    || offsetSize + clientSize > scrollSize + 1
    || !scrollSize
  )
    return

  emitScrollEvent(offsetSize, clientSize, scrollSize, evt)
  v.handleScroll(Math.max(0, offsetSize - clientSize / 2))
}

// set current scroll position to a expectant offset
function scrollToOffset(offset: number) {
  if (props.pageMode) {
    document.body[offsetSizeKey.value] = offset
    document.documentElement[offsetSizeKey.value] = offset

    return
  }

  if (scrollRef.value)
    scrollRef.value[offsetSizeKey.value] = offset
}

// set current scroll position to a expectant index
function scrollToIndex(index: number) {
  if (index < dataIds.value.length) {
    const offset = v.getOffset(index)
    scrollToOffset(offset)

    return
  }

  scrollToBottom()
}

// set current scroll position to bottom
function scrollToBottom() {
  if (!shepherdRef.value)
    return

  const offset
    = shepherdRef.value[isHorizontal.value ? 'offsetLeft' : 'offsetTop']
  scrollToOffset(offset)

  // check if it's really scrolled to the bottom
  // maybe list doesn't render and calculate to last range
  // so we need retry in next event loop until it really at bottom
  // setTimeout(() => {
  //   if (getOffsetSize() + getClientSize() < getScrollSize())
  //     scrollToBottom()
  // }, 30)
}

// when using page mode we need update slot header size manually
// taking root offset relative to the browser as slot header size
function updatePageModeFront() {
  if (!scrollRef.value)
    return

  const { defaultView } = scrollRef.value.ownerDocument
  if (!defaultView)
    return

  const rect = scrollRef.value.getBoundingClientRect()
  const offsetFront = isHorizontal.value
    ? rect.left + defaultView!.pageXOffset
    : rect.top + defaultView!.pageYOffset
  v.updateParam('slotHeaderSize', offsetFront)
}

// event called when each item mounted or size changed
function onItemResized(id: string, size: number) {
  v.saveSize(id, size)
  emit('resized', id, size)
}

// event called when slot mounted or size changed
function onSlotResized(type: string, size: number, init: boolean) {
  switch (type) {
    case 'thead':
      v.updateParam('slotHeaderSize', size)
      break

    case 'tfoot':
      v.updateParam('slotFooterSize', size)
      break
  }

  if (init)
    v.handleSlotSizeChange()
}

// here is the rerendering entry
function onRangeChanged(r: VirtualRange) {
  vr.value = [r.start, r.end + 1]
  wrapperStyle.value = getWrapperStyle(r.padBehind, r.padFront)
}

// emit event in special position
function emitScrollEvent(
  offsetSize: number,
  clientSize: number,
  scrollSize: number,
  evt?: Event,
) {
  emit('scroll', evt as UIEvent, v.getRange())

  if (
    v.isFront()
    && dataIds.value.length > 0
    && offsetSize - props.topThreshold <= 0
  ) {
    emit('totop')

    return
  }

  if (
    v.isBehind()
    && offsetSize + clientSize + props.bottomThreshold >= scrollSize
  )
    emit('tobottom')
}

function getWrapperStyle(
  padBehind: number,
  padFront: number,
): Record<string, any> {
  return {
    ...props.wrapStyle,
    padding: isHorizontal.value
      ? `0px ${padBehind}px 0px ${padFront}px`
      : `${padFront}px 0px ${padBehind}px`,
  }
}
</script>

<template>
  <Simplebar
    ref="rootRef"
    :key="`${props.dataKey}-list_root`"
    :scrollbar-min-size="100"
    :scrollbar-max-size="300"
    role="list"
    @scroll="(evt: UIEvent) => !props.pageMode && onScroll(evt)"
  >
    <!-- @scroll="(evt: UIEvent) => !props.pageMode && onScroll(evt)" -->
    <UiVirtualListSlot
      :key="`${props.dataKey}_list_header`"
      :tag="props.headerTag"
      :class="props.headerClass"
      :style="props.headerStyle"
      data-id="thead"
      @resize="onSlotResized"
    >
      <slot name="header" />
    </UiVirtualListSlot>

    <Component
      :is="props.wrapTag"
      :key="`${props.dataKey}_list_wrap`"
      :class="props.wrapClass"
      :style="wrapperStyle"
      role="group"
    >
      <Component
        :is="props.itemWrapTag"
        v-for="i in range(...vr).concat()"
        :key="`${props.dataKey}_list_component_wrap_${dataIds[i]}`"
        role="listitem"
      >
        <UiVirtualListItem
          :index="i"
          :tag="props.itemTag"
          :style="props.itemStyle"
          :horizontal="isHorizontal"
          :data-id="dataIds[i]"
          :data-key="props.dataKey"
          :data-getter="props.dataGetter"
          :extra-props="props.extraProps"
          :estimate-size="v.getEstimateSize()"
          :data-component="props.dataComponent"
          :slot-component="slots && slots.item"
          :scoped-slots="props.itemScopedSlots"
          :item-class="
            props.itemClass
              + (props.itemClassAdd ? ` ${props.itemClassAdd(i)}` : '')
          "
          @resize="onItemResized"
          @click="emit('itemClick', i)"
          @mouseover="emit('itemHover', i)"
        />
      </Component>
    </Component>

    <UiVirtualListSlot
      :key="`${props.dataKey}-list_footer`"
      :class="props.footerClass"
      :style="props.footerStyle"
      :tag="props.footerTag"
      data-id="tfoot"
      @resize="onSlotResized"
    >
      <slot name="footer" />
    </UiVirtualListSlot>
  </Simplebar>
</template>
