import type { Country } from '../types/country'

export function makeCountry(overrides: Partial<Country> = {}): Country {
  return {
    alpha3Code: 'XXX',
    name: 'Testland',
    nativeName: 'Testland',
    region: 'Europe',
    subregion: 'Western Europe',
    capital: 'Test City',
    topLevelDomain: ['.xx'],
    population: 1,
    flags: { svg: 'https://flagcdn.com/xx.svg', png: 'https://flagcdn.com/w320/xx.png' },
    currencies: [],
    languages: [],
    ...overrides,
  }
}
