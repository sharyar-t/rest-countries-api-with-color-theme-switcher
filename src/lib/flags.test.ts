import { withFlagHost } from './flags'

describe('withFlagHost', () => {
  it('switches flagcdn.com to flagcdn.io and keeps the path', () => {
    expect(withFlagHost('https://flagcdn.com/af.svg')).toBe('https://flagcdn.io/af.svg')
  })

  it('leaves other hosts untouched', () => {
    expect(withFlagHost('https://example.com/af.svg')).toBe('https://example.com/af.svg')
    expect(withFlagHost('https://notflagcdn.com/af.svg')).toBe('https://notflagcdn.com/af.svg')
  })

  it('does not throw on an invalid URL', () => {
    expect(withFlagHost('not a url')).toBe('not a url')
    expect(withFlagHost('')).toBe('')
  })
})
