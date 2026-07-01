<script setup lang="ts">
import { useTirePressureResultStore } from '~/stores/tirePressureResult'

definePageMeta({
  middleware: [
    function () {
      const { result } = useTirePressureResultStore()
      if (!result.value) {
        return navigateTo('/')
      }
    },
  ],
})

const { result } = useTirePressureResultStore()
</script>

<template>
  <main class="min-h-screen px-4 py-10 sm:py-16">
    <div class="mx-auto max-w-form">

      <!-- Back link -->
      <div class="mb-6">
        <NuxtLink
          to="/"
          class="text-small text-accent-300 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:ring-offset-2 rounded-md"
        >
          &larr; Back to form
        </NuxtLink>
      </div>

      <!-- Page heading -->
      <div class="mb-8 text-center">
        <h1 class="text-h1 text-white drop-shadow-sm">
          Recommended Tire Pressure
        </h1>
        <p class="mt-2 text-body text-neutral-200">
          {{ result?.surfaceLabel }} &middot; {{ result?.tireTypeLabel }} &middot; {{ result?.tireWidthMm }} mm
        </p>
      </div>

      <BaseCard>
        <!-- Front / Rear grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-lg bg-neutral-50 px-4 py-5 text-center dark:bg-neutral-700">
            <p class="text-small text-neutral-400">Front</p>
            <p class="mt-1 text-h1 text-accent-600 dark:text-accent-400">
              {{ result?.frontBar }}<span class="ml-1 text-h2 font-normal">bar</span>
            </p>
            <p class="mt-0.5 text-small text-neutral-500 dark:text-neutral-300">{{ result?.frontPsi }} psi</p>
          </div>
          <div class="rounded-lg bg-neutral-50 px-4 py-5 text-center dark:bg-neutral-700">
            <p class="text-small text-neutral-400">Rear</p>
            <p class="mt-1 text-h1 text-accent-600 dark:text-accent-400">
              {{ result?.rearBar }}<span class="ml-1 text-h2 font-normal">bar</span>
            </p>
            <p class="mt-0.5 text-small text-neutral-500 dark:text-neutral-300">{{ result?.rearPsi }} psi</p>
          </div>
        </div>

        <!-- Note -->
        <p class="mt-5 text-small text-neutral-600 dark:text-neutral-300">
          {{ result?.note }}
        </p>

        <!-- Limitations -->
        <ul class="mt-4 space-y-1">
          <li
            v-for="limitation in result?.limitations"
            :key="limitation"
            class="flex items-start gap-2 text-small text-neutral-400 dark:text-neutral-500"
          >
            <span class="mt-0.5 text-neutral-300 dark:text-neutral-600" aria-hidden="true">&bull;</span>
            {{ limitation }}
          </li>
        </ul>
      </BaseCard>

      <!-- Calculate again -->
      <div class="mt-8">
        <BaseButton type="button" @click="navigateTo('/')">
          Calculate again
        </BaseButton>
      </div>

    </div>
  </main>
</template>
