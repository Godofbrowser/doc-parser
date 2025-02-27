<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-[800px]" v-once>
      <viewer-content :content="props.content"></viewer-content>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  // The parsed XML content as an HTML string.
  content: {
    type: String,
    required: true,
  },
})
</script>
