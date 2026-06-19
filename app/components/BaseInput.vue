<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  label: string
  modelValue: string | number | null
  type?: 'text' | 'number'
  unit?: string
  error?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  unit: undefined,
  error: undefined,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputId = useId()
const errorId = computed(() => `${inputId}-error`)
const hasError = computed(() => Boolean(props.error))

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  if (props.type === 'number') {
    // Emit empty string when cleared so the parent can treat it as "no value".
    emit('update:modelValue', target.value === '' ? '' : target.valueAsNumber)
  } else {
    emit('update:modelValue', target.value)
  }
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="inputId" class="text-label font-medium text-neutral-700">
      {{ label }}
      <span v-if="required" class="text-danger-500" aria-hidden="true">*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :required="required"
        :aria-invalid="hasError"
        :aria-describedby="hasError ? errorId : undefined"
        :class="[
          'w-full rounded-md border bg-white px-3 py-2.5 text-body text-neutral-900 placeholder:text-neutral-400',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/40',
          'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400',
          unit ? 'pr-12' : '',
          hasError
            ? 'border-danger-500 focus:border-danger-500'
            : 'border-neutral-300 focus:border-accent-500',
        ]"
        @input="onInput"
      >
      <span
        v-if="unit"
        class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-small text-neutral-500"
      >
        {{ unit }}
      </span>
    </div>

    <p v-if="hasError" :id="errorId" class="text-label text-danger-700">
      {{ error }}
    </p>
  </div>
</template>
