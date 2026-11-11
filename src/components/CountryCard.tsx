import { Link } from 'react-router'
import type { Country } from '../types/country'

const formatPopulation = (value: number) => value.toLocaleString('en-US')

export default function CountryCard({ country }: { country: Country }) {
  const { alpha3Code, name, population, region, capital, flags } = country
  return (
    <Link
      to={`/country/${alpha3Code}`}
      className="block h-full overflow-hidden rounded-md bg-white shadow dark:bg-blue-900"
    >
      {/* alt пустой: название страны есть в тексте ссылки, дублировать его не нужно */}
      <img
        src={flags.svg}
        alt=""
        width={320}
        height={192}
        loading="lazy"
        className="aspect-[5/3] w-full object-cover"
      />
      <div className="p-6 pb-10">
        <h2 className="mb-4 text-lg font-extrabold">{name}</h2>
        <dl className="space-y-1 text-sm">
          <Row label="Population" value={formatPopulation(population)} />
          <Row label="Region" value={region} />
          <Row label="Capital" value={capital ?? 'N/A'} />
        </dl>
      </div>
    </Link>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1">
      <dt className="font-semibold">{label}:</dt>
      <dd>{value}</dd>
    </div>
  )
}
