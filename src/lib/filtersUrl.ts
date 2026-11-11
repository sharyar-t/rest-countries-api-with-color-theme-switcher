import type { CountryFilters } from './filterCountries'

export function parseFilters(
  params: URLSearchParams,
  validRegions: readonly string[],
): Required<CountryFilters> {
  const region = params.get('region') ?? ''
  return {
    query: params.get('q') ?? '',
    region: validRegions.includes(region) ? region : '',
  }
}

export function serializeFilters({ query = '', region = '' }: CountryFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (query.trim()) params.set('q', query)
  if (region) params.set('region', region)
  return params
}
