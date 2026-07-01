<script setup lang="ts">
interface Props {
  title?: string
}

defineProps<Props>()
</script>

<template>
  <section class="rounded-lg border border-white/40 bg-white/90 p-6 shadow-xl shadow-neutral-900/10 backdrop-blur-md dark:border-neutral-700/60 dark:bg-neutral-800/90">
    <h2 v-if="title" class="mb-4 text-h2 text-neutral-900 dark:text-neutral-50">
      {{ title }}
    </h2>
    <slot />
  </section>
</template>
