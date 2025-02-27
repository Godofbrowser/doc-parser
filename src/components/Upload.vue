<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <h1 class="text-4xl font-bold mb-8 uppercase">Doc Parser</h1>

    <div
      v-if="!isLoading"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="selectFileClickHandler"
      :class="[
        'w-full max-w-md border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
        isDragActive ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-300',
      ]"
    >
      <p class="text-gray-600 mb-4">Drag and drop your document here</p>
      <label class="text-sm text-gray-500 cursor-pointer"
        >or click to select a file
        <!-- Optional: If you want to allow clicking, you can add a hidden input -->
        <input type="file" class="hidden" ref="fileInput" @change="handleFileSelect" />
      </label>
    </div>

    <!-- Loading Spinner -->
    <div v-else class="flex flex-col items-center justify-center space-y-4">
      <svg
        class="animate-spin h-10 w-10 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <p class="text-lg font-medium text-gray-700">parsing content...</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { readFileContent } from '../helpers'

const isLoading = ref(false)
const isDragActive = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const emit = defineEmits({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: (value: string) => true,
})

const handleDragOver = () => {
  isDragActive.value = true
}

const handleDragLeave = () => {
  isDragActive.value = false
}

const handleDrop = (event: DragEvent) => {
  isDragActive.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    startParsing(files[0])
  }
}

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files && files.length > 0) {
    startParsing(files[0])
  }
}

const selectFileClickHandler = () => {
  fileInput.value?.click()
}

// Simulate parsing and set loading state
const startParsing = async (file: Blob) => {
  isLoading.value = true

  readFileContent(file).then((content) => {
    emit('input', content)
    console.log('Parsing complete.')
    isLoading.value = false
  })
}
</script>
