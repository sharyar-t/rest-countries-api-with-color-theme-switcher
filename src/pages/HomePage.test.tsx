import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { CountriesProvider } from '../context/CountriesProvider'
import { makeCountry } from '../lib/fixtures'
import HomePage from './HomePage'

const data = [
  makeCountry({ alpha3Code: 'DEU', name: 'Germany', region: 'Europe' }),
  makeCountry({ alpha3Code: 'FRA', name: 'France', region: 'Europe' }),
  makeCountry({ alpha3Code: 'BRA', name: 'Brazil', region: 'Americas' }),
  makeCountry({ alpha3Code: 'ATA', name: 'Antarctica', region: 'Polar' }),
]

beforeEach(() => vi.stubGlobal('fetch', vi.fn(async () => Response.json(data))))
afterEach(() => vi.unstubAllGlobals())

const renderHome = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <CountriesProvider>
        <HomePage />
      </CountriesProvider>
    </MemoryRouter>,
  )

const names = () => screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)

describe('HomePage', () => {
  it('shows all countries, including those from hidden regions', async () => {
    renderHome()
    expect(await screen.findByText('4 countries found')).toBeInTheDocument()
    expect(names()).toContain('Antarctica')
  })

  it('exposes only the visible regions in the select', async () => {
    renderHome()
    await screen.findByRole('combobox', { name: /filter by region/i })
    const options = screen.getAllByRole('option').map((o) => o.textContent)
    expect(options).toEqual(['Filter by Region', 'Americas', 'Europe'])
  })

  it('filters by search text (diacritic- and case-insensitive)', async () => {
    renderHome()
    await userEvent.type(await screen.findByRole('searchbox', { name: /search/i }), 'GERM')
    expect(names()).toEqual(['Germany'])
    expect(screen.getByText('1 country found')).toBeInTheDocument()
  })

  it('filters by region and can reset with the placeholder option', async () => {
    renderHome()
    const select = await screen.findByRole('combobox', { name: /filter by region/i })
    await userEvent.selectOptions(select, 'Europe')
    expect(names()).toEqual(['Germany', 'France'])
    await userEvent.selectOptions(select, '')
    expect(names()).toHaveLength(4)
  })

  it('restores filters from the URL', async () => {
    renderHome('/?q=fra&region=Europe')
    expect(await screen.findByText('1 country found')).toBeInTheDocument()
    expect(names()).toEqual(['France'])
  })

  it('shows an empty state when nothing matches', async () => {
    renderHome('/?q=zzz')
    expect(await screen.findByText(/no countries match/i)).toBeInTheDocument()
    expect(screen.getByText('0 countries found')).toBeInTheDocument()
  })

  it('shows an error with a retry button', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('x', { status: 500, statusText: 'Boom' })))
    renderHome()
    expect(await screen.findByRole('alert')).toHaveTextContent(/500/)
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })
})
