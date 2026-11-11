import { parseFilters, serializeFilters } from './filtersUrl'

const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

describe('parseFilters', () => {
  it('returns empty filters for empty params', () => {
    expect(parseFilters(new URLSearchParams(), regions)).toEqual({ query: '', region: '' })
  })

  it('reads q and region', () => {
    const params = new URLSearchParams('q=ger&region=Europe')
    expect(parseFilters(params, regions)).toEqual({ query: 'ger', region: 'Europe' })
  })

  it('does not trim the query (the input must keep what the user typed)', () => {
    expect(parseFilters(new URLSearchParams('q=%20ger%20'), regions).query).toBe(' ger ')
  })

  it('decodes encoded characters', () => {
    expect(parseFilters(new URLSearchParams('q=C%C3%B4te%20d%27Ivoire'), regions).query).toBe(
      "Côte d'Ivoire",
    )
  })

  it('falls back to "all" for an unknown region', () => {
    expect(parseFilters(new URLSearchParams('region=Atlantis'), regions).region).toBe('')
  })

  it('falls back to "all" for a hidden region absent from the list', () => {
    expect(parseFilters(new URLSearchParams('region=Polar'), regions).region).toBe('')
  })

  it('matches region case-sensitively', () => {
    expect(parseFilters(new URLSearchParams('region=europe'), regions).region).toBe('')
  })

  it('uses the first value when a param is repeated', () => {
    const params = new URLSearchParams('q=a&q=b&region=Asia&region=Europe')
    expect(parseFilters(params, regions)).toEqual({ query: 'a', region: 'Asia' })
  })

  it('ignores unrelated params', () => {
    expect(parseFilters(new URLSearchParams('foo=bar'), regions)).toEqual({ query: '', region: '' })
  })
})

describe('serializeFilters', () => {
  it('omits empty values', () => {
    expect(serializeFilters({ query: '', region: '' }).toString()).toBe('')
    expect(serializeFilters({}).toString()).toBe('')
  })

  it('omits a whitespace-only query', () => {
    expect(serializeFilters({ query: '   ' }).toString()).toBe('')
  })

  it('writes q and region', () => {
    const params = serializeFilters({ query: 'ger', region: 'Europe' })
    expect(params.get('q')).toBe('ger')
    expect(params.get('region')).toBe('Europe')
  })

  it('round-trips through parseFilters', () => {
    const filters = { query: "Côte d'Ivoire", region: 'Africa' }
    expect(parseFilters(serializeFilters(filters), regions)).toEqual(filters)
  })
})
