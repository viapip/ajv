<script setup>
const { setLocale, locale } = useI18n()
</script>

<template>
  <div class="flex flex-col w-full bg-primary-50 min-h-screen">
    <div class="flex flex-col justify-start flex-grow w-full justify-items-start">
      <!-- <div class="fixed top-0 bottom-0 left-0 right-0 overflow-visible pointer-events-none winbox-layer">
        <div id="teleport-layer--10" class="relative z-10 pointer-events-auto" />
        <div id="teleport-layer--20" class="relative z-20 pointer-events-auto" /> -->
      <!-- <WinboxRoot /> -->
      <!-- </div> -->
      <div class="flex flex-row items-stretch flex-grow page-header">
        <div class="z-30 flex flex-col justify-between border-r shadow-lg border-primary-700/80 bg-primary-800">
          <div class="flex flex-col items-center page-header-top">
            <NuxtLink
              :to="{
                name: 'index',
                query: {
                  id: 'test',
                },
              }"
            />
          </div>
          <div class="flex flex-col">
            <ColorMode
              size="lg"
              variant="solid"
              class="border-t border-dashed rounded-none bg-primary-900/60 border-primary-700 h-11"
            />
            <UButton
              size="lg"
              variant="solid"
              :icon="locale === 'ru' ? 'i-twemoji-flag-russia' : 'i-twemoji-flag-united-states'"
              class="border-t border-dashed rounded-none bg-primary-900/60 border-primary-700 h-11"
              @click="setLocale(
                locale === 'ru'
                  ? 'en'
                  : 'ru',
              )"
            />
          </div>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
