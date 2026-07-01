import type { TirePressureResult } from '~/composables/usePressureForm'

export interface TirePressureResultView extends TirePressureResult {
  tireWidthMm: number
}

// SSR-safe store shared between the form page and the result page —
// useState keeps one value per user request instead of leaking across requests.
export function useTirePressureResultStore() {
  const result = useState<TirePressureResultView | null>('tirePressureResult', () => null)

  function setResult(value: TirePressureResultView) {
    result.value = value
  }

  function clear() {
    result.value = null
  }

  return { result, setResult, clear }
}
