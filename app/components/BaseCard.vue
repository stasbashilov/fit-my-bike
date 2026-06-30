<script setup lang="ts">
interface Props {
  title?: string
}

defineProps<Props>()
</script>

<template>
  <section class="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
    <h2 v-if="title" class="mb-4 text-h2 text-neutral-900 dark:text-neutral-50">
      {{ title }}
    </h2>
    <slot />
  </section>
</template>
