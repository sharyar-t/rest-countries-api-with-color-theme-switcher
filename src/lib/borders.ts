import type { Country } from '../types/country'

export function buildCountryIndex(countries: readonly Country[]): ReadonlyMap<string, Country> {
  return new Map(countries.map((country) => [country.alpha3Code, country]))
}

export function resolveBorders(
  country: Country,
  index: ReadonlyMap<string, Country>,
): Country[] {
  return (country.borders ?? []).flatMap((code) => {
    const neighbour = index.get(code)
    return neighbour ? [neighbour] : []
  })
}
