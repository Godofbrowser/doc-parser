<script setup lang="ts">
import Upload from './components/Upload.vue'
import Viewer from './components/Viewer.vue'
import { useDocStore } from '@/stores/doc'

const docStore = useDocStore()
</script>

<template>
  <main>
    <Upload
      v-if="!docStore.parsedContent || docStore.isParsing"
      @input="docStore.parseXml($event)"
    />
    <Viewer v-else :content="docStore.parsedContent" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
