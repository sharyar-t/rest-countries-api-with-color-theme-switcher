import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import App from './App'
import { makeCountry } from './lib/fixtures'

const data = [
  makeCountry({ alpha3Code: 'DEU', name: 'Germany', borders: ['FRA'] }),
  makeCountry({ alpha3Code: 'FRA', name: 'France', borders: ['DEU'] }),
]

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => Response.json(data)))
  vi.stubGlobal('scrollTo', vi.fn())
  document.title = ''
})
afterEach(() => vi.unstubAllGlobals())

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

describe('routing', () => {
  it('renders the list on /', async () => {
    renderAt('/')
    expect(await screen.findByText('2 countries found')).toBeInTheDocument()
  })

  it('renders the country page on /country/:code', async () => {
    renderAt('/country/DEU')
    expect(await screen.findByRole('heading', { level: 1, name: 'Germany' })).toBeInTheDocument()
  })

  it('renders not-found for unknown paths', () => {
    renderAt('/nope')
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })

  it('has exactly one h1 per page', async () => {
    renderAt('/')
    await screen.findByText('2 countries found')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
})

describe('document title', () => {
  it('is the site title on the list', async () => {
    renderAt('/')
    await screen.findByText('2 countries found')
    expect(document.title).toBe('Where in the world?')
  })

  it('includes the country name on a country page and follows navigation', async () => {
    renderAt('/country/DEU')
    await screen.findByRole('heading', { name: 'Germany' })
    expect(document.title).toBe('Germany – Where in the world?')
    await userEvent.click(screen.getByRole('link', { name: 'France' }))
    await waitFor(() => expect(document.title).toBe('France – Where in the world?'))
  })

  it('reflects unknown country and unknown page', async () => {
    renderAt('/country/XXX')
    await screen.findByRole('heading', { name: 'Country not found' })
    expect(document.title).toBe('Country not found – Where in the world?')
  })

  it('reflects a not-found page', () => {
    renderAt('/nope')
    expect(document.title).toBe('Page not found – Where in the world?')
  })
})

describe('focus management', () => {
  it('does not move focus on the initial load', async () => {
    renderAt('/country/DEU')
    await screen.findByRole('heading', { name: 'Germany' })
    expect(document.body).toHaveFocus()
  })

  it('moves focus to the new page h1 and scrolls to top after a link click', async () => {
    renderAt('/')
    await userEvent.click(await screen.findByRole('link', { name: /germany/i }))
    const heading = await screen.findByRole('heading', { level: 1, name: 'Germany' })
    await waitFor(() => expect(heading).toHaveFocus())
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('moves focus when navigating between countries', async () => {
    renderAt('/country/DEU')
    await userEvent.click(await screen.findByRole('link', { name: 'France' }))
    const heading = await screen.findByRole('heading', { level: 1, name: 'France' })
    await waitFor(() => expect(heading).toHaveFocus())
  })

  it('does not steal focus when only the search params change', async () => {
    renderAt('/')
    const input = await screen.findByRole('searchbox', { name: /search/i })
    await userEvent.type(input, 'ger')
    expect(input).toHaveFocus()
    await userEvent.selectOptions(screen.getByRole('combobox'), '')
    expect(window.scrollTo).not.toHaveBeenCalled()
  })
})
