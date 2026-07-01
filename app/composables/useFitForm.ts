import { ref, reactive } from 'vue'
import type { Discipline } from '../../shared/schemas/fitRequest'
import { useFitResult } from '~/composables/useFitResult'
import type { FitResult } from '~/composables/useFitResult'

interface FitFormValues {
  height: number | ''
  inseam: number | ''
  armLength: number | ''
  shoulderWidth: number | ''
  discipline: Discipline | ''
}

interface FitFormErrors {
  height: string
  inseam: string
  armLength: string
  shoulderWidth: string
  discipline: string
}

export function useFitForm() {
  const values = reactive<FitFormValues>({
    height: '',
    inseam: '',
    armLength: '',
    shoulderWidth: '',
    discipline: '',
  })

  const errors = reactive<FitFormErrors>({
    height: '',
    inseam: '',
    armLength: '',
    shoulderWidth: '',
    discipline: '',
  })

  const loading = ref(false)
  const submitError = ref('')

  const { result } = useFitResult()

  function validate(): boolean {
    let valid = true

    if (values.height === '' || values.height === null) {
      errors.height = 'Height is required.'
      valid = false
    } else if (values.height < 1200 || values.height > 2200) {
      errors.height = 'Height must be between 1200 and 2200 mm.'
      valid = false
    } else {
      errors.height = ''
    }

    if (values.inseam === '' || values.inseam === null) {
      errors.inseam = 'Inseam is required.'
      valid = false
    } else if (values.inseam < 500 || values.inseam > 1200) {
      errors.inseam = 'Inseam must be between 500 and 1200 mm.'
      valid = false
    } else {
      errors.inseam = ''
    }

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

    if (!values.discipline) {
      errors.discipline = 'Please select a discipline.'
      valid = false
    } else {
      errors.discipline = ''
    }

    return valid
  }

  async function onSubmit() {
    if (!validate()) return

    loading.value = true
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

      result.value = data as FitResult
      await navigateTo('/result')
    } catch (err: unknown) {
      const fetchError = err as { data?: { error?: string } }
      submitError.value =
        fetchError?.data?.error ?? 'Something went wrong. Please check your connection and try again.'
    } finally {
      loading.value = false
    }
  }

  function onNumber(
    field: keyof Pick<FitFormValues, 'height' | 'inseam' | 'armLength' | 'shoulderWidth'>,
    value: string | number,
  ) {
    values[field] = value === '' || value === null ? '' : (value as number)
  }

  return { values, errors, loading, submitError, onSubmit, onNumber }
}
