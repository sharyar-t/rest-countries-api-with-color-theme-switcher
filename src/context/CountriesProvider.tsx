import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { buildCountryIndex } from '../lib/borders'
import { loadCountries } from '../lib/loadCountries'
import { getRegions } from '../lib/regions'
import type { Country } from '../types/country'
import { CountriesContext, type CountriesContextValue } from './countriesContext'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; countries: Country[] }

export function CountriesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    loadCountries(controller.signal).then(
      (countries) => setState({ status: 'success', countries }),
      (error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          error: error instanceof Error ? error : new Error(String(error)),
        })
      },
    )
    return () => controller.abort()
  }, [attempt])

  const reload = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  const value = useMemo<CountriesContextValue>(() => {
    if (state.status !== 'success') return { ...state, reload }
    return {
      status: 'success',
      countries: state.countries,
      index: buildCountryIndex(state.countries),
      regions: getRegions(state.countries),
      reload,
    }
  }, [state, reload])

  return <CountriesContext value={value}>{children}</CountriesContext>
}
