import { StrictMode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { makeCountry } from '../lib/fixtures'
import { CountriesProvider } from './CountriesProvider'
import { useCountries } from './useCountries'

function Probe() {
  const state = useCountries()
  if (state.status === 'loading') return <p>loading</p>
  if (state.status === 'error') {
    return (
      <>
        <p>error: {state.error.message}</p>
        <button onClick={state.reload}>retry</button>
      </>
    )
  }
  return (
    <p>
      ok: {state.countries.length} / {state.regions.join(',')} / {state.index.get('DEU')?.name}
    </p>
  )
}

const renderProbe = () =>
  render(
    <StrictMode>
      <CountriesProvider>
        <Probe />
      </CountriesProvider>
    </StrictMode>,
  )

afterEach(() => vi.unstubAllGlobals())

describe('CountriesProvider', () => {
  it('goes loading -> success and exposes index and regions', async () => {
    const data = [
      makeCountry({ alpha3Code: 'DEU', name: 'Germany', region: 'Europe' }),
      makeCountry({ alpha3Code: 'POL', region: 'Polar' }),
    ]
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(data)))
    renderProbe()
    expect(screen.getByText('loading')).toBeInTheDocument()
    expect(await screen.findByText('ok: 2 / Europe / Germany')).toBeInTheDocument()
  })

  it('shows an error and recovers via reload', async () => {
    // Флаг, а не mockResolvedValueOnce: в StrictMode первый (отменённый) запрос
    // забрал бы «одноразовый» ответ.
    let failing = true
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        failing
          ? new Response('x', { status: 500, statusText: 'Boom' })
          : Response.json([makeCountry({ alpha3Code: 'DEU', name: 'Germany' })]),
      ),
    )
    renderProbe()
    expect(await screen.findByText(/error: .*500/)).toBeInTheDocument()
    failing = false
    await userEvent.click(screen.getByRole('button', { name: 'retry' }))
    expect(await screen.findByText(/ok: 1/)).toBeInTheDocument()
  })
})

describe('useCountries', () => {
  it('throws outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Probe />)).toThrow(/CountriesProvider/)
    spy.mockRestore()
  })
})
