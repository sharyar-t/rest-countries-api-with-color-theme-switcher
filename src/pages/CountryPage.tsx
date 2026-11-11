import { Link, useParams } from 'react-router'
import CountriesGate from '../components/CountriesGate'
import PageHeading from '../components/PageHeading'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { resolveBorders } from '../lib/borders'
import type { Country } from '../types/country'

const NONE = 'N/A'

export default function CountryPage() {
  const { code = '' } = useParams()
  return (
    <div className="space-y-12 px-4 py-6 md:px-20 md:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-md bg-white px-8 py-2 shadow dark:bg-blue-900"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2">
          <path d="M19 12H5m6-6-6 6 6 6" />
        </svg>
        Back
      </Link>
      <CountriesGate>
        {({ index }) => {
          const country = index.get(code.toUpperCase())
          return country ? <CountryDetails country={country} index={index} /> : <CountryNotFound />
        }}
      </CountriesGate>
    </div>
  )
}

function CountryNotFound() {
  useDocumentTitle('Country not found')
  return (
    <div className="space-y-4">
      <PageHeading className="text-2xl font-extrabold">Country not found</PageHeading>
      <p>We couldn't find a country with that code.</p>
    </div>
  )
}

function CountryDetails({
  country,
  index,
}: {
  country: Country
  index: ReadonlyMap<string, Country>
}) {
  useDocumentTitle(country.name)
  const borders = resolveBorders(country, index)
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-32">
      <img
        src={country.flags.svg}
        alt={`Flag of ${country.name}`}
        className="aspect-[7/5] w-full object-cover shadow"
      />
      <div className="space-y-8">
        <PageHeading className="text-2xl font-extrabold">{country.name}</PageHeading>
        <div className="grid gap-8 sm:grid-cols-2">
          <dl className="space-y-2">
            <Row label="Native Name" value={country.nativeName} />
            <Row label="Population" value={country.population.toLocaleString('en-US')} />
            <Row label="Region" value={country.region} />
            <Row label="Sub Region" value={country.subregion || NONE} />
            <Row label="Capital" value={country.capital ?? NONE} />
          </dl>
          <dl className="space-y-2">
            <Row label="Top Level Domain" value={country.topLevelDomain.join(', ') || NONE} />
            <Row
              label="Currencies"
              value={country.currencies?.map((c) => c.name).join(', ') || NONE}
            />
            <Row label="Languages" value={country.languages.map((l) => l.name).join(', ') || NONE} />
          </dl>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-semibold">Border Countries:</h2>
          {borders.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {borders.map((b) => (
                <li key={b.alpha3Code}>
                  <Link
                    to={`/country/${b.alpha3Code}`}
                    className="block rounded-sm bg-white px-6 py-1 text-sm shadow dark:bg-blue-900"
                  >
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <span>None</span>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-1">
      <dt className="font-semibold">{label}:</dt>
      <dd>{value}</dd>
    </div>
  )
}
