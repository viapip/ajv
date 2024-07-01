<script setup lang="ts">
const isOpen = ref(false)
const jose = useJose()
const input = ref<string>(JSON.stringify(jose.privateKey.value, null, 2))
function onSaveKeys() {
  jose.privateKey.value = JSON.parse(input.value)

  isOpen.value = false
}
function onInput(v: string) {
  input.value = v
}
</script>

<template>
  <div class="flex items-center mt-10">
    <UButton class="mr-6" @click="isOpen = true">
      input keys
    </UButton>

    <UModal v-model="isOpen">
      <div class="p-4 flex flex-col">
        <UTextarea
          :value="input"
          placeholder="Private key" :rows="10"
          @update:model-value="onInput"
        />
        <UButton class="mt-2 justify-center" @click="onSaveKeys">
          Save
        </UButton>
      </div>
    </UModal>
  </div>
</template>
