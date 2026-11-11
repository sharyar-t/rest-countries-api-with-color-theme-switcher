import { makeCountry } from './fixtures'
import { getRegions } from './regions'

describe('getRegions', () => {
  it('returns unique regions sorted alphabetically', () => {
    const countries = [
      makeCountry({ region: 'Europe' }),
      makeCountry({ region: 'Asia' }),
      makeCountry({ region: 'Europe' }),
      makeCountry({ region: 'Africa' }),
    ]
    expect(getRegions(countries)).toEqual(['Africa', 'Asia', 'Europe'])
  })

  it('hides Polar, Antarctic and Antarctic Ocean', () => {
    const countries = [
      makeCountry({ region: 'Polar' }),
      makeCountry({ region: 'Antarctic' }),
      makeCountry({ region: 'Antarctic Ocean' }),
      makeCountry({ region: 'Oceania' }),
    ]
    expect(getRegions(countries)).toEqual(['Oceania'])
  })

  it('returns [] for an empty list', () => {
    expect(getRegions([])).toEqual([])
  })

  it('ignores countries with an empty region string', () => {
    expect(getRegions([makeCountry({ region: '' })])).toEqual([])
  })
})
