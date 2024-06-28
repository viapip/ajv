<script setup lang="ts">
import Simplebar from 'simplebar-core'
import { onMounted, ref } from 'vue'

const props = defineProps({
  scrollbarMaxSize: {
    type: Number,
    default: 100,
  },
  scrollbarMinSize: {
    type: Number,
    default: 10,
  },
})

const emits = defineEmits<{
  scroll: [event: UIEvent]
}>()

const sb = ref<Simplebar>()

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)

defineExpose({
  sb,

  rootRef,
  scrollRef,
})

onMounted(() => {
  sb.value = new Simplebar(rootRef.value!, {
    ...Simplebar.defaultOptions,
    ...props,
  })
})
</script>

<template>
  <div ref="rootRef" data-simplebar="init">
    <div class="simplebar-wrapper">
      <div class="simplebar-height-auto-observer-wrapper">
        <div class="simplebar-height-auto-observer" />
      </div>
      <div class="simplebar-mask">
        <div class="simplebar-offset">
          <div
            ref="scrollRef"
            class="simplebar-content-wrapper"
            @scroll="(e) => emits('scroll', e)"
          >
            <div class="simplebar-content">
              <slot />
            </div>
          </div>
        </div>
      </div>
      <div class="simplebar-placeholder" />
    </div>
    <div class="simplebar-track simplebar-horizontal">
      <div class="simplebar-scrollbar" />
    </div>
    <div class="simplebar-track simplebar-vertical">
      <div class="simplebar-scrollbar" />
    </div>
  </div>
</template>

<style lang="postcss">
@import url('simplebar-core/dist/simplebar.css');

[data-simplebar] {
  @apply h-full;
  .simplebar-content-wrapper{
    @apply flex flex-col;
  }
  .simplebar-content {
    @apply flex-grow flex flex-col;
  }

  .simplebar-track {
    @apply bg-transparent w-4 right-0 left-auto;

    .simplebar-scrollbar {
      &::before {
        @apply bg-primary-600 opacity-20 top-2 left-2 right-1 bottom-2 rounded-md transition-all;
      }

      &.simplebar-visible::before {
        @apply bg-primary-900 opacity-40;
      }
    }

    &.simplebar-hover {
      .simplebar-scrollbar::before {
        @apply bg-primary-500 left-1 right-1 opacity-60;
      }
    }
  }

  &.simplebar-scrolling {
    .simplebar-track {
      .simplebar-scrollbar::before {
        @apply bg-primary-600 left-1.5 right-1 opacity-30;
      }
    }
  }

  &.simplebar-dragging {
    .simplebar-track {
      .simplebar-scrollbar::before {
        @apply bg-primary-500 left-1 right-1 opacity-75;
      }
    }
  }
}
</style>
