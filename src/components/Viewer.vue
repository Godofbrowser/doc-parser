<template>
  <!-- Outer container with light gray background, centered content, and padding -->
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <!-- Inner content container with max width, white background, and shadow for depth -->
    <div
      class="w-full max-w-[800px] bg-white p-6 shadow-md doc-content"
      v-html="props.content"
      v-once
    ></div>
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

<style lang="scss">
// Define a map for heading properties
$headings: (
  h1: (
    font-size: 2.25rem,
    font-weight: 700,
    margin-top: 1.5rem,
  ),
  h2: (
    font-size: 1.875rem,
    font-weight: 600,
    margin-top: 1.25rem,
  ),
  h3: (
    font-size: 1.5rem,
    font-weight: 600,
    margin-top: 1rem,
  ),
  h4: (
    font-size: 1.25rem,
    font-weight: 600,
    margin-top: 0.75rem,
  ),
  h5: (
    font-size: 1.125rem,
    font-weight: 600,
    margin-top: 0.5rem,
  ),
  h6: (
    font-size: 1rem,
    font-weight: 500,
    margin-top: 0.5rem,
  ),
);

.doc-content {
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;

  // Loop through each heading and apply styles
  @each $tag, $props in $headings {
    #{$tag} {
      font-size: map-get($props, font-size);
      font-weight: map-get($props, font-weight);
      margin-top: map-get($props, margin-top);
      margin-bottom: 0.5rem;
    }
  }

  p {
    font-size: 1rem;
    line-height: 1.625;
    margin: 1rem 0;
  }

  ul,
  ol {
    margin: 1rem 0;
    margin-left: 1.5rem;

    li {
      margin: 0.25rem 0;
    }
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  @media (max-width: 600px) {
    padding: 10px;
  }
}
</style>
