import { formatTitle } from './title'

describe('formatTitle', () => {
  it('returns the site title without a page name', () => {
    expect(formatTitle()).toBe('Where in the world?')
    expect(formatTitle('')).toBe('Where in the world?')
  })

  it('prefixes the page name', () => {
    expect(formatTitle('Germany')).toBe('Germany – Where in the world?')
  })
})
