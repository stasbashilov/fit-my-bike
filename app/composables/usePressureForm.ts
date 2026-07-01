import { ref, reactive } from 'vue'
import type { Surface, TireType } from '../../shared/schemas/tirePressureRequest'
import { useTirePressureResultStore } from '~/stores/tirePressureResult'

export interface TirePressureResult {
  frontBar: number
  rearBar: number
  frontPsi: number
  rearPsi: number
  surfaceLabel: string
  tireTypeLabel: string
  note: string
  limitations: string[]
}

interface PressureFormValues {
  riderWeight: number | ''
  bikeWeight: number | ''
  tireWidthMm: number | ''
  tireType: TireType | ''
  surface: Surface | ''
}

interface PressureFormErrors {
  riderWeight: string
  bikeWeight: string
  tireWidthMm: string
  tireType: string
  surface: string
}

export function usePressureForm() {
  const values = reactive<PressureFormValues>({
    riderWeight: '',
    bikeWeight: '',
    tireWidthMm: '',
    tireType: '',
    surface: '',
  })

  const errors = reactive<PressureFormErrors>({
    riderWeight: '',
    bikeWeight: '',
    tireWidthMm: '',
    tireType: '',
    surface: '',
  })

  const loading = ref(false)
  const submitError = ref('')
  const { setResult, clear } = useTirePressureResultStore()

  const tireWidthUnit = ref<'mm' | 'in'>('mm')
  const tireWidthInches = ref<number | ''>('')

  function onTireWidthUnitChange(unit: 'mm' | 'in') {
    tireWidthUnit.value = unit
    values.tireWidthMm = ''
    tireWidthInches.value = ''
    errors.tireWidthMm = ''
  }

  function onTireWidthMmInput(event: Event) {
    const target = event.target as unknown as { value: string; valueAsNumber: number }
    onNumber('tireWidthMm', target.value === '' ? '' : target.valueAsNumber)
  }

  function onTireWidthInchesInput(event: Event) {
    const target = event.target as unknown as { value: string; valueAsNumber: number }
    tireWidthInches.value = target.value === '' ? '' : target.valueAsNumber
  }

  function validate(): boolean {
    let valid = true

    if (values.riderWeight === '' || values.riderWeight === null) {
      errors.riderWeight = 'Rider weight is required.'
      valid = false
    } else if (values.riderWeight < 20 || values.riderWeight > 200) {
      errors.riderWeight = 'Rider weight must be between 20 and 200 kg.'
      valid = false
    } else {
      errors.riderWeight = ''
    }

    if (values.bikeWeight !== '' && values.bikeWeight !== null) {
      if (values.bikeWeight < 3 || values.bikeWeight > 30) {
        errors.bikeWeight = 'Bike weight must be between 3 and 30 kg.'
        valid = false
      } else {
        errors.bikeWeight = ''
      }
    } else {
      errors.bikeWeight = ''
    }

    if (tireWidthUnit.value === 'mm') {
      if (values.tireWidthMm === '' || values.tireWidthMm === null) {
        errors.tireWidthMm = 'Tire width is required.'
        valid = false
      } else if (values.tireWidthMm < 18 || values.tireWidthMm > 80) {
        errors.tireWidthMm = 'Tire width must be between 18 and 80 mm.'
        valid = false
      } else {
        errors.tireWidthMm = ''
      }
    } else {
      if (tireWidthInches.value === '' || tireWidthInches.value === null) {
        errors.tireWidthMm = 'Tire width is required.'
        valid = false
      } else {
        const mm = Math.round((tireWidthInches.value as number) * 25.4)
        if (mm < 18 || mm > 80) {
          errors.tireWidthMm = 'Tire width must be between 0.71" and 3.15" (18–80 mm).'
          valid = false
        } else {
          errors.tireWidthMm = ''
        }
      }
    }

    if (!values.tireType) {
      errors.tireType = 'Please select a tire type.'
      valid = false
    } else {
      errors.tireType = ''
    }

    if (!values.surface) {
      errors.surface = 'Please select a surface.'
      valid = false
    } else {
      errors.surface = ''
    }

    return valid
  }

  async function onSubmit() {
    if (!validate()) return

    loading.value = true
    submitError.value = ''
    clear()

    try {
      const tireWidthMm = tireWidthUnit.value === 'mm'
        ? values.tireWidthMm as number
        : Math.round((tireWidthInches.value as number) * 25.4)

      const data = await $fetch('/api/tire-pressure', {
        method: 'POST',
        body: {
          riderWeight: values.riderWeight as number,
          bikeWeight: values.bikeWeight !== '' ? (values.bikeWeight as number) : undefined,
          tireWidthMm,
          tireType: values.tireType as string,
          surface: values.surface as string,
        },
      })
      setResult({ ...(data as TirePressureResult), tireWidthMm })
      await navigateTo('/pressure-result')
    } catch (err: unknown) {
      const fetchError = err as { data?: { error?: string } }
      submitError.value =
        fetchError?.data?.error ?? 'Something went wrong. Please check your connection and try again.'
    } finally {
      loading.value = false
    }
  }

  function onNumber(
    field: keyof Pick<PressureFormValues, 'riderWeight' | 'bikeWeight' | 'tireWidthMm'>,
    value: string | number,
  ) {
    values[field] = value === '' || value === null ? '' : (value as number)
  }

  return {
    values,
    errors,
    loading,
    submitError,
    tireWidthUnit,
    tireWidthInches,
    onTireWidthUnitChange,
    onTireWidthMmInput,
    onTireWidthInchesInput,
    onSubmit,
    onNumber,
  }
}
