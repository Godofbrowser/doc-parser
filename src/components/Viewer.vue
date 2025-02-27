<template>
  <div class="h-screen overflow-auto bg-gray-50 flex justify-center p-4">
    <div class="w-full max-w-[800px]">
      <button @click="backClickHandler" class="cursor-pointer">
        <ChevronLeftIcon class="size-4" /> Back
      </button>
      <viewer-content :content="props.content"></viewer-content>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue'

const props = defineProps({
  // The parsed XML content as an HTML string.
  content: {
    type: String,
    required: true,
  },
})

const emit = defineEmits({
  close: () => true,
})

const backClickHandler = () => {
  emit('close')
}
</script>
