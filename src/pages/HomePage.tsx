import CountriesGate from '../components/CountriesGate'
import CountryGrid from '../components/CountryGrid'
import PageHeading from '../components/PageHeading'
import RegionSelect from '../components/RegionSelect'
import SearchInput from '../components/SearchInput'
import type { CountriesReady } from '../context/countriesContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useFilters } from '../hooks/useFilters'
import { filterCountries } from '../lib/filterCountries'

export default function HomePage() {
  useDocumentTitle()
  return <CountriesGate>{(data) => <CountryList data={data} />}</CountriesGate>
}

function CountryList({ data }: { data: CountriesReady }) {
  const { filters, setQuery, setRegion } = useFilters(data.regions)
  const visible = filterCountries(data.countries, filters)
  return (
    <div className="space-y-8 px-4 py-6 md:px-20 md:py-12">
      <PageHeading className="sr-only">Countries</PageHeading>
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <SearchInput value={filters.query} onChange={setQuery} />
        <RegionSelect value={filters.region} regions={data.regions} onChange={setRegion} />
      </div>
      <p role="status" className="sr-only">
        {visible.length} {visible.length === 1 ? 'country' : 'countries'} found
      </p>
      {visible.length > 0 ? (
        <CountryGrid countries={visible} />
      ) : (
        <p>No countries match your search.</p>
      )}
    </div>
  )
}
