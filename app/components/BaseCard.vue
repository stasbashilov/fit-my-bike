<script setup lang="ts">
interface Props {
  title?: string
}

defineProps<Props>()
</script>

<template>
  <section class="rounded-lg border border-neutral-200 bg-white p-6">
    <h2 v-if="title" class="mb-4 text-h2 text-neutral-900">
      {{ title }}
    </h2>
    <slot />
  </section>
</template>
