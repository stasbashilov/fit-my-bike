<script setup lang="ts">
import { computed, useId } from 'vue'

interface SelectOption {
  value: string
  label: string
}

interface Props {
  label: string
  modelValue: string
  options: SelectOption[]
  error?: string
  required?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  error: undefined,
  required: false,
  placeholder: 'Select an option',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectId = useId()
const errorId = computed(() => `${selectId}-error`)
const hasError = computed(() => Boolean(props.error))

function onChange(event: Event) {
  // Cast via unknown first — Event.target is typed as EventTarget | null
  // which doesn't overlap with HTMLSelectElement in strict lib mode.
  const target = event.target as unknown as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="selectId" class="text-label font-medium text-neutral-700 dark:text-neutral-200">
      {{ label }}
      <span v-if="required" class="text-danger-500" aria-hidden="true">*</span>
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :required="required"
        :aria-invalid="hasError"
        :aria-describedby="hasError ? errorId : undefined"
        :class="[
          'w-full appearance-none rounded-md border bg-white px-3 py-2.5 pr-10',
          'dark:bg-neutral-800',
          'text-body transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/40',
          'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-500',
          hasError
            ? 'border-danger-500 focus:border-danger-500'
            : 'border-neutral-300 focus:border-accent-500 dark:border-neutral-600 dark:focus:border-accent-400',
          modelValue === '' ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-900 dark:text-neutral-100',
        ]"
        @change="onChange"
      >
        <option value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          class="text-neutral-900"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Custom dropdown chevron -->
      <span
        class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-500 dark:text-neutral-400"
        aria-hidden="true"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>

    <p v-if="hasError" :id="errorId" class="text-label text-danger-700 dark:text-danger-500">
      {{ error }}
    </p>
  </div>
</template>
