// FitResult mirrors the interface defined in server/utils/fit-calculations.ts.
// Duplicated here to avoid a server → client import crossing the boundary.
export interface FitResult {
  saddleHeight: number
  saddleHeightNote?: string
  torsoAngleMin: number
  torsoAngleMax: number
  torsoAngleNote?: string
  handlebarWidth?: number
  handlebarWidthNote?: string
  disciplineLabel: string
  limitations: string[]
}

// SSR-safe store shared between the form page and the result page —
// useState keeps one value per user request instead of leaking across requests.
export function useFitResultStore() {
  const result = useState<FitResult | null>('fitResult', () => null)

  function setResult(value: FitResult) {
    result.value = value
  }

  function clear() {
    result.value = null
  }

  return { result, setResult, clear }
}
