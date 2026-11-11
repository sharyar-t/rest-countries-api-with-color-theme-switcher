import { buildCountryIndex, resolveBorders } from './borders'
import { makeCountry } from './fixtures'

const deu = makeCountry({ alpha3Code: 'DEU', name: 'Germany', borders: ['FRA', 'POL'] })
const fra = makeCountry({ alpha3Code: 'FRA', name: 'France', borders: ['DEU'] })
const pol = makeCountry({ alpha3Code: 'POL', name: 'Poland', borders: ['DEU'] })
const isl = makeCountry({ alpha3Code: 'ISL', name: 'Iceland' }) // нет поля borders

describe('buildCountryIndex', () => {
  it('indexes countries by alpha3Code', () => {
    const index = buildCountryIndex([deu, fra])
    expect(index.get('DEU')).toBe(deu)
    expect(index.get('FRA')).toBe(fra)
    expect(index.get('XXX')).toBeUndefined()
  })
})

describe('resolveBorders', () => {
  const index = buildCountryIndex([deu, fra, pol, isl])

  it('resolves border codes to countries, preserving order', () => {
    expect(resolveBorders(deu, index)).toEqual([fra, pol])
  })

  it('returns [] when the country has no borders field', () => {
    expect(resolveBorders(isl, index)).toEqual([])
  })

  it('skips codes that are absent from the index instead of throwing', () => {
    const odd = makeCountry({ alpha3Code: 'ODD', borders: ['FRA', 'ZZZ'] })
    expect(resolveBorders(odd, index)).toEqual([fra])
  })
})
