import { useId } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function SearchInput({ value, onChange }: Props) {
  const id = useId()
  return (
    <div className="relative w-full md:max-w-md">
      <label htmlFor={id} className="sr-only">
        Search for a country
      </label>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute top-1/2 left-6 size-4 -translate-y-1/2 fill-none stroke-grey-400 stroke-2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search for a country…"
        autoComplete="off"
        className="h-14 w-full rounded-md bg-white pr-4 pl-16 shadow placeholder:text-grey-400 dark:bg-blue-900 dark:placeholder:text-white"
      />
    </div>
  )
}
