import type { Country } from '../types/country'

export interface CountryFilters {
  query?: string
  region?: string
}

const normalize = (value: string): string =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

export function filterCountries(
  countries: readonly Country[],
  { query = '', region = '' }: CountryFilters,
): Country[] {
  const needle = normalize(query)
  return countries.filter(
    (country) =>
      (!region || country.region === region) &&
      (!needle || normalize(country.name).includes(needle)),
  )
}
