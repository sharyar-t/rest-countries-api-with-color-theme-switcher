import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { CountriesProvider } from '../context/CountriesProvider'
import { makeCountry } from '../lib/fixtures'
import CountryPage from './CountryPage'

const data = [
  makeCountry({
    alpha3Code: 'DEU',
    name: 'Germany',
    nativeName: 'Deutschland',
    population: 83516593,
    topLevelDomain: ['.de'],
    currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
    languages: [{ iso639_2: 'deu', name: 'German' }],
    borders: ['FRA', 'ZZZ'],
  }),
  makeCountry({ alpha3Code: 'FRA', name: 'France' }),
  makeCountry({ alpha3Code: 'ISL', name: 'Iceland', capital: undefined, currencies: undefined }),
]

beforeEach(() => vi.stubGlobal('fetch', vi.fn(async () => Response.json(data))))
afterEach(() => vi.unstubAllGlobals())

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <CountriesProvider>
        <Routes>
          <Route path="/" element={<p>home</p>} />
          <Route path="/country/:code" element={<CountryPage />} />
        </Routes>
      </CountriesProvider>
    </MemoryRouter>,
  )

describe('CountryPage', () => {
  it('shows the country details', async () => {
    renderAt('/country/DEU')
    expect(await screen.findByRole('heading', { level: 1, name: 'Germany' })).toBeInTheDocument()
    expect(screen.getByText('Deutschland')).toBeInTheDocument()
    expect(screen.getByText('83,516,593')).toBeInTheDocument()
    expect(screen.getByText('.de')).toBeInTheDocument()
    expect(screen.getByText('Euro')).toBeInTheDocument()
    expect(screen.getByText('German')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Flag of Germany' })).toBeInTheDocument()
  })

  it('resolves the code case-insensitively', async () => {
    renderAt('/country/deu')
    expect(await screen.findByRole('heading', { name: 'Germany' })).toBeInTheDocument()
  })

  it('links to border countries and skips unknown codes', async () => {
    renderAt('/country/DEU')
    const link = await screen.findByRole('link', { name: 'France' })
    expect(link).toHaveAttribute('href', '/country/FRA')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  it('shows None for a country without borders and N/A for missing fields', async () => {
    renderAt('/country/ISL')
    await screen.findByRole('heading', { name: 'Iceland' })
    expect(screen.getByText('None')).toBeInTheDocument()
    expect(screen.getAllByText('N/A').length).toBeGreaterThanOrEqual(2)
  })

  it('shows a message for an unknown code', async () => {
    renderAt('/country/XXX')
    expect(await screen.findByText('Country not found')).toBeInTheDocument()
  })

  it('has a Back link to the list without filters', async () => {
    renderAt('/country/DEU')
    await screen.findByRole('heading', { name: 'Germany' })
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/')
  })
})
