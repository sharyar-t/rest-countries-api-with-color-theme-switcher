import type { Country } from '../types/country'
import CountryCard from './CountryCard'

export default function CountryGrid({ countries }: { countries: readonly Country[] }) {
  return (
    <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-18">
      {countries.map((country) => (
        <li key={country.alpha3Code}>
          <CountryCard country={country} />
        </li>
      ))}
    </ul>
  )
}
