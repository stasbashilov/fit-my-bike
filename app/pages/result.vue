<script setup lang="ts">
import { useFitResult } from '~/composables/useFitResult'

definePageMeta({
  middleware: [
    function () {
      const { result } = useFitResult()
      if (!result.value) {
        return navigateTo('/')
      }
    },
  ],
})

const { result } = useFitResult()
</script>

<template>
  <main class="min-h-screen bg-neutral-50 px-4 py-10 sm:py-16">
    <div class="mx-auto max-w-form">

      <!-- Back link -->
      <div class="mb-6">
        <NuxtLink
          to="/"
          class="text-small text-accent-600 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:ring-offset-2 rounded-md"
        >
          &larr; Back to form
        </NuxtLink>
      </div>

      <!-- Page heading -->
      <div class="mb-8 text-center">
        <h1 class="text-h1 text-neutral-900">
          Your Fit Recommendation
        </h1>
        <p class="mt-2 text-body text-neutral-500">
          For {{ result?.disciplineLabel }}
        </p>
      </div>

      <div class="space-y-4">

        <!-- Saddle Height card -->
        <BaseCard title="Saddle Height">
          <p class="text-h1 text-accent-600">
            {{ result?.saddleHeight }} mm
          </p>
          <p class="mt-1 text-small text-neutral-500">
            From bottom bracket center to top of saddle
          </p>
          <p
            v-if="result?.saddleHeightNote"
            class="mt-3 rounded-md border border-neutral-200 bg-neutral-100 p-3 text-small text-neutral-700"
          >
            {{ result.saddleHeightNote }}
          </p>
        </BaseCard>

        <!-- Body Position card -->
        <BaseCard title="Body Position">
          <p class="text-small text-neutral-500">
            Target torso angle from horizontal
          </p>
          <p class="mt-1 text-h2 text-neutral-900">
            {{ result?.torsoAngleMin }}&deg;&ndash;{{ result?.torsoAngleMax }}&deg;
          </p>
          <p
            v-if="result?.torsoAngleNote"
            class="mt-1 text-small text-neutral-500 italic"
          >
            {{ result.torsoAngleNote }}
          </p>
          <p class="mt-3 text-center text-label text-neutral-400">
            Smaller angle = more aggressive / aero &nbsp;|&nbsp; Larger angle = more upright / comfort
          </p>
        </BaseCard>

        <!-- Handlebar Width card — only when handlebarWidth is present -->
        <BaseCard v-if="result?.handlebarWidth !== undefined" title="Handlebar Width">
          <p class="text-h2 text-neutral-900">
            {{ result.handlebarWidth }} mm
          </p>
          <p
            v-if="result.handlebarWidthNote"
            class="mt-1 text-small text-neutral-500"
          >
            {{ result.handlebarWidthNote }}
          </p>
        </BaseCard>

        <!-- Limitations card -->
        <BaseCard title="Model Limitations">
          <p class="text-small text-neutral-500">
            This is a starting-point estimate. Always verify on the bike.
          </p>
          <ul class="mt-3 space-y-1" aria-label="Model limitations">
            <li
              v-for="(limitation, index) in result?.limitations"
              :key="index"
              class="flex gap-2 text-small text-neutral-500"
            >
              <span aria-hidden="true" class="mt-px shrink-0 text-neutral-400">&bull;</span>
              {{ limitation }}
            </li>
          </ul>
        </BaseCard>

      </div>

      <!-- Calculate again -->
      <div class="mt-8">
        <BaseButton type="button" @click="navigateTo('/')">
          Calculate again
        </BaseButton>
      </div>

    </div>
  </main>
</template>
