import { useId } from 'react'

interface Props {
  value: string
  regions: readonly string[]
  onChange: (value: string) => void
}

export default function RegionSelect({ value, regions, onChange }: Props) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        Filter by region
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full rounded-md bg-white px-6 shadow md:w-52 dark:bg-blue-900"
      >
        <option value="">Filter by Region</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  )
}
