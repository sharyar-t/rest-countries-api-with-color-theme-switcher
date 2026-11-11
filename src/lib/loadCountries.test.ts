import { makeCountry } from './fixtures'
import { loadCountries } from './loadCountries'

afterEach(() => vi.unstubAllGlobals())

const stubFetch = (impl: typeof fetch) => vi.stubGlobal('fetch', vi.fn(impl))

describe('loadCountries', () => {
  it('requests data.json relative to BASE_URL and returns the parsed array', async () => {
    const country = makeCountry({
      alpha3Code: 'DEU',
      flags: { svg: 'https://flagcdn.io/de.svg', png: 'https://flagcdn.io/de.png' },
    })
    stubFetch(async () => Response.json([country]))
    await expect(loadCountries()).resolves.toEqual([country])
    expect(fetch).toHaveBeenCalledWith(`${import.meta.env.BASE_URL}data.json`, {
      signal: undefined,
    })
  })

  it('passes the abort signal to fetch', async () => {
    stubFetch(async () => Response.json([]))
    const { signal } = new AbortController()
    await loadCountries(signal)
    expect(fetch).toHaveBeenCalledWith(expect.any(String), { signal })
  })

  it('points svg flags at flagcdn.io and leaves png untouched', async () => {
    const country = makeCountry({
      flags: { svg: 'https://flagcdn.com/de.svg', png: 'https://flagcdn.com/w320/de.png' },
    })
    stubFetch(async () => Response.json([country]))
    const [loaded] = await loadCountries()
    expect(loaded.flags).toEqual({
      svg: 'https://flagcdn.io/de.svg',
      png: 'https://flagcdn.com/w320/de.png',
    })
  })

  it('throws on a non-ok response', async () => {
    stubFetch(async () => new Response('nope', { status: 404, statusText: 'Not Found' }))
    await expect(loadCountries()).rejects.toThrow(/404/)
  })

  it('throws when the payload is not an array', async () => {
    stubFetch(async () => Response.json({ not: 'an array' }))
    await expect(loadCountries()).rejects.toThrow(/unexpected data format/)
  })

  it('propagates network errors', async () => {
    stubFetch(async () => {
      throw new TypeError('Failed to fetch')
    })
    await expect(loadCountries()).rejects.toThrow('Failed to fetch')
  })
})
