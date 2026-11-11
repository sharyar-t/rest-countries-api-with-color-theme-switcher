import type { Country } from '../types/country'

const HIDDEN_REGIONS: ReadonlySet<string> = new Set(['Polar', 'Antarctic', 'Antarctic Ocean'])

export function getRegions(countries: readonly Country[]): string[] {
  const regions = new Set<string>()
  for (const { region } of countries) {
    if (region && !HIDDEN_REGIONS.has(region)) regions.add(region)
  }
  return [...regions].sort((a, b) => a.localeCompare(b))
}
