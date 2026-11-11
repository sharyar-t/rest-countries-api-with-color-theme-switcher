import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { makeCountry } from '../lib/fixtures'
import CountryCard from './CountryCard'

const renderCard = (overrides = {}) =>
  render(
    <MemoryRouter>
      <CountryCard
        country={makeCountry({ alpha3Code: 'DEU', name: 'Germany', population: 83516593, ...overrides })}
      />
    </MemoryRouter>,
  )

describe('CountryCard', () => {
  it('links to the country page by alpha3Code', () => {
    renderCard()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/country/DEU')
  })

  it('shows name and formatted population', () => {
    renderCard()
    expect(screen.getByRole('heading', { name: 'Germany' })).toBeInTheDocument()
    expect(screen.getByText('83,516,593')).toBeInTheDocument()
  })

  it('shows N/A when there is no capital', () => {
    renderCard({ capital: undefined })
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })

  it('keeps the link name equal to its text (flag image is decorative)', () => {
    renderCard()
    expect(screen.getByRole('link').querySelector('img')).toHaveAttribute('alt', '')
  })
})
