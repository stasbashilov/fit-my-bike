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

export function useFitResult() {
  const result = useState<FitResult | null>('fitResult', () => null)
  return { result }
}
