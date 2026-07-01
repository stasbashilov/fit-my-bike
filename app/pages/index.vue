<script setup lang="ts">
import { ref } from 'vue'
import { useFitForm } from '~/composables/useFitForm'
import { usePressureForm } from '~/composables/usePressureForm'
import { disciplineOptions, surfaceOptions, tireTypeOptions } from '~/constants/options'

type Tab = 'fit' | 'pressure'
const activeTab = ref<Tab>('fit')

const {
  values: fitValues,
  errors: fitErrors,
  loading: fitLoading,
  submitError: fitSubmitError,
  onSubmit: onFitSubmit,
  onNumber: onFitNumber,
} = useFitForm()

const {
  values: pressureValues,
  errors: pressureErrors,
  loading: pressureLoading,
  submitError: pressureSubmitError,
  result: pressureResult,
  tireWidthUnit,
  tireWidthInches,
  onTireWidthUnitChange,
  onTireWidthMmInput,
  onTireWidthInchesInput,
  onSubmit: onPressureSubmit,
  onNumber: onPressureNumber,
} = usePressureForm()
</script>

<template>
  <main class="min-h-screen bg-neutral-50 px-4 py-10 sm:py-16 dark:bg-neutral-900">
    <div class="mx-auto max-w-form">

      <!-- Page heading -->
      <div class="mb-8 text-center">
        <h1 class="text-h1 text-neutral-900 dark:text-neutral-50">
          Bike Calculator
        </h1>
        <p class="mt-2 text-body text-neutral-500 dark:text-neutral-400">
          Personalised recommendations from your measurements.
        </p>
      </div>

      <!-- Tabs ────────────────────────────────────────────────────────────── -->
      <div class="mb-6 flex rounded-lg border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
        <button
          type="button"
          class="flex-1 rounded-md py-2 text-small font-medium transition-colors"
          :class="activeTab === 'fit'
            ? 'bg-accent-500 text-white shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'"
          @click="activeTab = 'fit'"
        >
          Bike Fit
        </button>
        <button
          type="button"
          class="flex-1 rounded-md py-2 text-small font-medium transition-colors"
          :class="activeTab === 'pressure'
            ? 'bg-accent-500 text-white shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'"
          @click="activeTab = 'pressure'"
        >
          Tire Pressure
        </button>
      </div>

      <!-- ── Tab 1: Bike Fit ─────────────────────────────────────────────── -->
      <div v-show="activeTab === 'fit'">
        <BaseCard>
          <form novalidate @submit.prevent="onFitSubmit">
            <div class="space-y-5">

              <BaseInput
                label="Height"
                type="number"
                unit="mm"
                required
                :model-value="fitValues.height"
                :error="fitErrors.height"
                @update:model-value="onFitNumber('height', $event)"
              />

              <BaseInput
                label="Inseam"
                type="number"
                unit="mm"
                required
                :model-value="fitValues.inseam"
                :error="fitErrors.inseam"
                @update:model-value="onFitNumber('inseam', $event)"
              />

              <BaseSelect
                label="Discipline"
                placeholder="Select your discipline"
                required
                :model-value="fitValues.discipline"
                :options="disciplineOptions"
                :error="fitErrors.discipline"
                @update:model-value="fitValues.discipline = $event as typeof fitValues.discipline"
              />

              <div class="relative py-1">
                <div class="absolute inset-0 flex items-center" aria-hidden="true">
                  <div class="w-full border-t border-neutral-200 dark:border-neutral-700" />
                </div>
                <div class="relative flex justify-center">
                  <span class="bg-white px-3 text-small text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
                    Optional (improves accuracy)
                  </span>
                </div>
              </div>

              <BaseInput
                label="Arm Length"
                type="number"
                unit="mm"
                :model-value="fitValues.armLength"
                :error="fitErrors.armLength"
                @update:model-value="onFitNumber('armLength', $event)"
              />

              <BaseInput
                label="Shoulder Width"
                type="number"
                unit="mm"
                :model-value="fitValues.shoulderWidth"
                :error="fitErrors.shoulderWidth"
                @update:model-value="onFitNumber('shoulderWidth', $event)"
              />

            </div>

            <div class="mt-8">
              <p v-if="fitSubmitError" role="alert" class="mb-3 text-small text-danger-700 dark:text-danger-500">
                {{ fitSubmitError }}
              </p>

              <BaseButton type="submit" :loading="fitLoading" :disabled="fitLoading">
                Get my fit recommendation
              </BaseButton>

              <p class="mt-4 text-center text-small text-neutral-400 dark:text-neutral-500">
                This is an approximate recommendation. For precise fit, consult a professional fitter.
              </p>
            </div>
          </form>
        </BaseCard>
      </div>

      <!-- ── Tab 2: Tire Pressure ────────────────────────────────────────── -->
      <div v-show="activeTab === 'pressure'">
        <BaseCard>
          <form novalidate @submit.prevent="onPressureSubmit">
            <div class="space-y-5">

              <BaseInput
                label="Rider Weight"
                type="number"
                unit="kg"
                required
                :model-value="pressureValues.riderWeight"
                :error="pressureErrors.riderWeight"
                @update:model-value="onPressureNumber('riderWeight', $event)"
              />

              <BaseInput
                label="Bike Weight"
                type="number"
                unit="kg"
                :model-value="pressureValues.bikeWeight"
                :error="pressureErrors.bikeWeight"
                @update:model-value="onPressureNumber('bikeWeight', $event)"
              />

              <!-- Tire Width with mm /- in toggle -->
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-label font-medium text-neutral-700 dark:text-neutral-200">
                    Tire Width <span class="text-danger-500" aria-hidden="true">*</span>
                  </span>
                  <div class="flex overflow-hidden rounded-md border border-neutral-200 text-small dark:border-neutral-600">
                    <button
                      type="button"
                      class="px-2.5 py-0.5 transition-colors"
                      :class="tireWidthUnit === 'mm' ? 'bg-accent-500 text-white' : 'bg-white text-neutral-500 hover:text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'"
                      @click="onTireWidthUnitChange('mm')"
                    >mm</button>
                    <button
                      type="button"
                      class="px-2.5 py-0.5 transition-colors"
                      :class="tireWidthUnit === 'in' ? 'bg-accent-500 text-white' : 'bg-white text-neutral-500 hover:text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'"
                      @click="onTireWidthUnitChange('in')"
                    >in</button>
                  </div>
                </div>

                <div class="relative">
                  <input
                    v-if="tireWidthUnit === 'mm'"
                    type="number"
                    :value="pressureValues.tireWidthMm"
                    placeholder="e.g. 25"
                    :aria-invalid="Boolean(pressureErrors.tireWidthMm)"
                    class="w-full rounded-md border bg-white px-3 py-2.5 pr-12 text-body text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/40 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                    :class="pressureErrors.tireWidthMm ? 'border-danger-500 focus:border-danger-500' : 'border-neutral-300 focus:border-accent-500 dark:border-neutral-600 dark:focus:border-accent-400'"
                    @input="onTireWidthMmInput"
                  >
                  <input
                    v-else
                    type="number"
                    step="0.05"
                    :value="tireWidthInches"
                    placeholder="e.g. 2.1"
                    :aria-invalid="Boolean(pressureErrors.tireWidthMm)"
                    class="w-full rounded-md border bg-white px-3 py-2.5 pr-10 text-body text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/40 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                    :class="pressureErrors.tireWidthMm ? 'border-danger-500 focus:border-danger-500' : 'border-neutral-300 focus:border-accent-500 dark:border-neutral-600 dark:focus:border-accent-400'"
                    @input="onTireWidthInchesInput"
                  >
                  <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-small text-neutral-500 dark:text-neutral-400">
                    {{ tireWidthUnit }}
                  </span>
                </div>

                <p class="text-label text-neutral-400 dark:text-neutral-500">
                  <template v-if="tireWidthUnit === 'mm'">
                    Road 23–32 · Gravel 35–50 · MTB 48–65 mm
                  </template>
                  <template v-else>
                    Road 0.9–1.25" · Gravel 1.4–2.0" · MTB 1.9–2.6"
                  </template>
                </p>

                <p v-if="pressureErrors.tireWidthMm" class="text-label text-danger-700 dark:text-danger-500">
                  {{ pressureErrors.tireWidthMm }}
                </p>
              </div>

              <BaseSelect
                label="Tire Type"
                placeholder="Select tire type"
                required
                :model-value="pressureValues.tireType"
                :options="tireTypeOptions"
                :error="pressureErrors.tireType"
                @update:model-value="pressureValues.tireType = $event as typeof pressureValues.tireType"
              />

              <BaseSelect
                label="Surface"
                placeholder="Select surface"
                required
                :model-value="pressureValues.surface"
                :options="surfaceOptions"
                :error="pressureErrors.surface"
                @update:model-value="pressureValues.surface = $event as typeof pressureValues.surface"
              />

            </div>

            <div class="mt-8">
              <p v-if="pressureSubmitError" role="alert" class="mb-3 text-small text-danger-700 dark:text-danger-500">
                {{ pressureSubmitError }}
              </p>

              <BaseButton type="submit" :loading="pressureLoading" :disabled="pressureLoading">
                Calculate tire pressure
              </BaseButton>
            </div>
          </form>
        </BaseCard>

        <!-- Inline result ──────────────────────────────────────────────────── -->
        <div v-if="pressureResult" class="mt-6">
          <BaseCard>
            <!-- Header -->
            <div class="mb-5 border-b border-neutral-100 pb-4 dark:border-neutral-700">
              <p class="text-small text-neutral-400 dark:text-neutral-500">
                {{ pressureResult.surfaceLabel }} · {{ pressureResult.tireTypeLabel }} ·
                <template v-if="tireWidthUnit === 'in'">
                  {{ tireWidthInches }}" ({{ Math.round((tireWidthInches as number) * 25.4) }} mm)
                </template>
                <template v-else>
                  {{ pressureValues.tireWidthMm }} mm
                </template>
              </p>
              <h2 class="text-h2 text-neutral-900 dark:text-neutral-50">
                Recommended Pressure
              </h2>
            </div>

            <!-- Front / Rear grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-lg bg-neutral-50 px-4 py-5 text-center dark:bg-neutral-700">
                <p class="text-small text-neutral-400">Front</p>
                <p class="mt-1 text-h1 text-accent-600 dark:text-accent-400">
                  {{ pressureResult.frontBar }}<span class="ml-1 text-h2 font-normal">bar</span>
                </p>
                <p class="mt-0.5 text-small text-neutral-500 dark:text-neutral-300">{{ pressureResult.frontPsi }} psi</p>
              </div>
              <div class="rounded-lg bg-neutral-50 px-4 py-5 text-center dark:bg-neutral-700">
                <p class="text-small text-neutral-400">Rear</p>
                <p class="mt-1 text-h1 text-accent-600 dark:text-accent-400">
                  {{ pressureResult.rearBar }}<span class="ml-1 text-h2 font-normal">bar</span>
                </p>
                <p class="mt-0.5 text-small text-neutral-500 dark:text-neutral-300">{{ pressureResult.rearPsi }} psi</p>
              </div>
            </div>

            <!-- Note -->
            <p class="mt-5 text-small text-neutral-600 dark:text-neutral-300">
              {{ pressureResult.note }}
            </p>

            <!-- Limitations -->
            <ul class="mt-4 space-y-1">
              <li
                v-for="limitation in pressureResult.limitations"
                :key="limitation"
                class="flex items-start gap-2 text-small text-neutral-400 dark:text-neutral-500"
              >
                <span class="mt-0.5 text-neutral-300 dark:text-neutral-600" aria-hidden="true">•</span>
                {{ limitation }}
              </li>
            </ul>
          </BaseCard>
        </div>
      </div>

    </div>
  </main>
</template>
