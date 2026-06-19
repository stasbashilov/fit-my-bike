<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useFitResult } from '~/composables/useFitResult'

// ── Types ────────────────────────────────────────────────────────────────────

type Discipline =
  | 'road'
  | 'tt_triathlon'
  | 'mtb_xc'
  | 'gravel'
  | 'cyclocross'
  | 'touring'
  | 'kids'
  | ''

interface FormValues {
  height: number | ''
  inseam: number | ''
  armLength: number | ''
  shoulderWidth: number | ''
  discipline: Discipline
}

interface FormErrors {
  height: string
  inseam: string
  armLength: string
  shoulderWidth: string
  discipline: string
}

// ── State ────────────────────────────────────────────────────────────────────

const values = reactive<FormValues>({
  height: '',
  inseam: '',
  armLength: '',
  shoulderWidth: '',
  discipline: '',
})

const errors = reactive<FormErrors>({
  height: '',
  inseam: '',
  armLength: '',
  shoulderWidth: '',
  discipline: '',
})

const isLoading = ref(false)
const submitError = ref('')

const { result } = useFitResult()

// ── Options ──────────────────────────────────────────────────────────────────

const disciplineOptions = [
  { value: 'road', label: 'Road (racing)' },
  { value: 'tt_triathlon', label: 'Time Trial / Triathlon' },
  { value: 'mtb_xc', label: 'MTB Cross-Country' },
  { value: 'gravel', label: 'Gravel' },
  { value: 'cyclocross', label: 'Cyclocross' },
  { value: 'touring', label: 'Touring' },
  { value: 'kids', label: 'Kids' },
]

// ── Validation ───────────────────────────────────────────────────────────────

function validate(): boolean {
  let valid = true

  // height: required, 1200–2200 mm
  if (values.height === '' || values.height === null) {
    errors.height = 'Height is required.'
    valid = false
  } else if (values.height < 1200 || values.height > 2200) {
    errors.height = 'Height must be between 1200 and 2200 mm.'
    valid = false
  } else {
    errors.height = ''
  }

  // inseam: required, 500–1200 mm
  if (values.inseam === '' || values.inseam === null) {
    errors.inseam = 'Inseam is required.'
    valid = false
  } else if (values.inseam < 500 || values.inseam > 1200) {
    errors.inseam = 'Inseam must be between 500 and 1200 mm.'
    valid = false
  } else {
    errors.inseam = ''
  }

  // armLength: optional, but if provided must be 400–900 mm
  if (values.armLength !== '' && values.armLength !== null) {
    if (values.armLength < 400 || values.armLength > 900) {
      errors.armLength = 'Arm length must be between 400 and 900 mm.'
      valid = false
    } else {
      errors.armLength = ''
    }
  } else {
    errors.armLength = ''
  }

  // shoulderWidth: optional, but if provided must be 300–600 mm
  if (values.shoulderWidth !== '' && values.shoulderWidth !== null) {
    if (values.shoulderWidth < 300 || values.shoulderWidth > 600) {
      errors.shoulderWidth = 'Shoulder width must be between 300 and 600 mm.'
      valid = false
    } else {
      errors.shoulderWidth = ''
    }
  } else {
    errors.shoulderWidth = ''
  }

  // discipline: required
  if (!values.discipline) {
    errors.discipline = 'Please select a discipline.'
    valid = false
  } else {
    errors.discipline = ''
  }

  return valid
}

// ── Submit ────────────────────────────────────────────────────────────────────

async function onSubmit() {
  const isValid = validate()
  if (!isValid) return

  isLoading.value = true
  submitError.value = ''

  try {
    const data = await $fetch('/api/fit-recommendation', {
      method: 'POST',
      body: {
        height: values.height as number,
        inseam: values.inseam as number,
        armLength: values.armLength !== '' ? (values.armLength as number) : undefined,
        shoulderWidth: values.shoulderWidth !== '' ? (values.shoulderWidth as number) : undefined,
        discipline: values.discipline as string,
      },
    })

    result.value = data as import('~/composables/useFitResult').FitResult
    await navigateTo('/result')
  } catch (err: unknown) {
    const fetchError = err as { data?: { error?: string } }
    submitError.value =
      fetchError?.data?.error ??
      'Something went wrong. Please check your connection and try again.'
  } finally {
    isLoading.value = false
  }
}

// ── Input helpers ─────────────────────────────────────────────────────────────

function onNumberInput(field: keyof Pick<FormValues, 'height' | 'inseam' | 'armLength' | 'shoulderWidth'>, value: string | number) {
  // BaseInput emits '' when the field is cleared, or a number otherwise.
  if (value === '' || value === null) {
    values[field] = ''
  } else {
    values[field] = value as number
  }
}

function onDisciplineChange(value: string) {
  values.discipline = value as Discipline
}
</script>

<template>
  <main class="min-h-screen bg-neutral-50 px-4 py-10 sm:py-16">
    <div class="mx-auto max-w-form">

      <!-- Page heading -->
      <div class="mb-8 text-center">
        <h1 class="text-h1 text-neutral-900">
          Bike Fit Calculator
        </h1>
        <p class="mt-2 text-body text-neutral-500">
          Enter your measurements to get a personalised fit starting point.
        </p>
      </div>

      <!-- Form ─────────────────────────────────────────────────────────── -->
      <BaseCard>
        <form novalidate @submit.prevent="onSubmit">
          <div class="space-y-5">

            <!-- Required fields -->
            <BaseInput
              label="Height"
              type="number"
              unit="mm"
              required
              :model-value="values.height"
              :error="errors.height"
              @update:model-value="onNumberInput('height', $event)"
            />

            <BaseInput
              label="Inseam"
              type="number"
              unit="mm"
              required
              :model-value="values.inseam"
              :error="errors.inseam"
              @update:model-value="onNumberInput('inseam', $event)"
            />

            <BaseSelect
              label="Discipline"
              placeholder="Select your discipline"
              required
              :model-value="values.discipline"
              :options="disciplineOptions"
              :error="errors.discipline"
              @update:model-value="onDisciplineChange($event)"
            />

            <!-- Divider: optional fields -->
            <div class="relative py-1">
              <div class="absolute inset-0 flex items-center" aria-hidden="true">
                <div class="w-full border-t border-neutral-200" />
              </div>
              <div class="relative flex justify-center">
                <span class="bg-white px-3 text-small text-neutral-400">
                  Optional (improves accuracy)
                </span>
              </div>
            </div>

            <!-- Optional fields -->
            <BaseInput
              label="Arm Length"
              type="number"
              unit="mm"
              :model-value="values.armLength"
              :error="errors.armLength"
              @update:model-value="onNumberInput('armLength', $event)"
            />

            <BaseInput
              label="Shoulder Width"
              type="number"
              unit="mm"
              :model-value="values.shoulderWidth"
              :error="errors.shoulderWidth"
              @update:model-value="onNumberInput('shoulderWidth', $event)"
            />

          </div>

          <!-- Submit -->
          <div class="mt-8">
            <p
              v-if="submitError"
              role="alert"
              class="mb-3 text-small text-danger-700"
            >
              {{ submitError }}
            </p>

            <BaseButton
              type="submit"
              :loading="isLoading"
              :disabled="isLoading"
            >
              Get my fit recommendation
            </BaseButton>

            <p class="mt-4 text-center text-small text-neutral-400">
              This is an approximate recommendation. For precise fit, consult a professional fitter.
            </p>
          </div>
        </form>
      </BaseCard>

    </div>
  </main>
</template>
