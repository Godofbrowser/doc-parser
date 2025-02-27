<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import Upload from './components/Upload.vue'
import Viewer from './components/Viewer.vue'
import { useDocStore } from '@/stores/doc'
import { gsap } from 'gsap'

const docStore = useDocStore()
const boxUpload = ref<HTMLDivElement | null>(null)
const boxViewer = ref<HTMLDivElement | null>(null)

let tl: gsap.core.Timeline
let ctx: gsap.Context

onMounted(async () => {
  await nextTick()
  gsap.set(boxViewer.value, { x: 200, opacity: 0 }) // Initialize position
  gsap.set(boxUpload.value, { zIndex: 100 }) // Initialize z-index
  ctx = gsap.context(() => {
    tl = gsap.timeline({ paused: true, reversed: true, ease: 'power1.inOut' })
    tl.to(boxUpload.value, { x: -200, opacity: 0, duration: 0.5 }).to(
      boxViewer.value,
      { x: 0, opacity: 1, duration: 0.5 },
      '-=0.3',
    )
    tl.eventCallback('onComplete', () => {
      gsap.set(boxUpload.value, { zIndex: 0 })
    })
    tl.eventCallback('onReverseComplete', () => {
      gsap.set(boxUpload.value, { zIndex: 100 })
    })
  })
})

onUnmounted(() => {
  ctx?.revert() // <- Easy Cleanup!
})

watch(
  () => docStore.parsedContent,
  (value, newVal) => {
    if (value !== newVal) toggleAnimation()
  },
)

const toggleAnimation = () => {
  if (tl.reversed()) {
    tl.play()
  } else {
    tl.reverse()
  }
}
</script>

<template>
  <main class="relative">
    <div ref="boxUpload" class="absolute top-0 left-0 w-full">
      <Upload @input="docStore.parseXml($event)" @return="toggleAnimation" />
    </div>
    <div ref="boxViewer" class="absolute top-0 left-0 w-full">
      <Viewer :content="docStore.parsedContent" @close="toggleAnimation" />
    </div>
  </main>
</template>
