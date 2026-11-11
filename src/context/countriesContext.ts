import { createContext } from 'react'
import type { Country } from '../types/country'

type Base = { reload: () => void }

export type CountriesContextValue =
  | (Base & { status: 'loading' })
  | (Base & { status: 'error'; error: Error })
  | (Base & {
      status: 'success'
      countries: readonly Country[]
      index: ReadonlyMap<string, Country>
      regions: readonly string[]
    })

export const CountriesContext = createContext<CountriesContextValue | null>(null)

export type CountriesReady = Extract<CountriesContextValue, { status: 'success' }>
