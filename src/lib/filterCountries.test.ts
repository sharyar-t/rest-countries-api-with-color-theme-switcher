import { filterCountries } from './filterCountries'
import { makeCountry } from './fixtures'

const germany = makeCountry({ alpha3Code: 'DEU', name: 'Germany', region: 'Europe' })
const france = makeCountry({ alpha3Code: 'FRA', name: 'France', region: 'Europe' })
const brazil = makeCountry({ alpha3Code: 'BRA', name: 'Brazil', region: 'Americas' })
const aland = makeCountry({ alpha3Code: 'ALA', name: 'Åland Islands', region: 'Europe' })
const ivory = makeCountry({ alpha3Code: 'CIV', name: "Côte d'Ivoire", region: 'Africa' })
const all = [germany, france, brazil, aland, ivory]

describe('filterCountries', () => {
  it('returns every country when there are no filters', () => {
    expect(filterCountries(all, {})).toEqual(all)
    expect(filterCountries(all, { query: '', region: '' })).toEqual(all)
  })

  it('does not mutate the input array and keeps its order', () => {
    const copy = [...all]
    const result = filterCountries(all, { query: 'a' })
    expect(all).toEqual(copy)
    expect(result).not.toBe(all)
    expect(result.map((c) => c.alpha3Code)).toEqual(
      copy.filter((c) => c.name.toLowerCase().includes('a')).map((c) => c.alpha3Code),
    )
  })

  describe('by name', () => {
    it('matches a substring', () => {
      expect(filterCountries(all, { query: 'rman' })).toEqual([germany])
    })

    it('is case-insensitive', () => {
      expect(filterCountries(all, { query: 'FRANCE' })).toEqual([france])
    })

    it('ignores leading and trailing whitespace', () => {
      expect(filterCountries(all, { query: '  brazil ' })).toEqual([brazil])
    })

    it('treats a whitespace-only query as no filter', () => {
      expect(filterCountries(all, { query: '   ' })).toEqual(all)
    })

    it('is diacritic-insensitive in both directions', () => {
      expect(filterCountries(all, { query: 'aland' })).toEqual([aland])
      expect(filterCountries(all, { query: 'côte' })).toEqual([ivory])
      expect(filterCountries(all, { query: 'cote' })).toEqual([ivory])
    })

    it('treats regex and special characters literally', () => {
      expect(filterCountries(all, { query: '.*' })).toEqual([])
      expect(filterCountries(all, { query: "d'ivoire" })).toEqual([ivory])
    })

    it('returns an empty array when nothing matches', () => {
      expect(filterCountries(all, { query: 'zzz' })).toEqual([])
    })
  })

  describe('by region', () => {
    it('keeps only the exact region', () => {
      expect(filterCountries(all, { region: 'Europe' })).toEqual([germany, france, aland])
    })

    it('returns an empty array for an unknown region', () => {
      expect(filterCountries(all, { region: 'Atlantis' })).toEqual([])
    })

    it('treats an empty region as "all"', () => {
      expect(filterCountries(all, { region: '' })).toEqual(all)
    })
  })

  it('combines query and region with AND', () => {
    expect(filterCountries(all, { query: 'a', region: 'Americas' })).toEqual([brazil])
    expect(filterCountries(all, { query: 'brazil', region: 'Europe' })).toEqual([])
  })
})
