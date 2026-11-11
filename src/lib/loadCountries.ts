import type { Country } from '../types/country'
import { withFlagHost } from './flags'

export async function loadCountries(signal?: AbortSignal): Promise<Country[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}data.json`, { signal })
  if (!response.ok) {
    throw new Error(`Failed to load countries: ${response.status} ${response.statusText}`)
  }
  const data: unknown = await response.json()
  if (!Array.isArray(data)) {
    throw new Error('Failed to load countries: unexpected data format')
  }
  // Подмена хоста флагов делается один раз на границе данных, компоненты о ней не знают
  return (data as Country[]).map((country) => ({
    ...country,
    flags: { ...country.flags, svg: withFlagHost(country.flags.svg) },
  }))
}
