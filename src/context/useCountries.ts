import { useContext } from 'react'
import { CountriesContext, type CountriesContextValue } from './countriesContext'

export function useCountries(): CountriesContextValue {
  const value = useContext(CountriesContext)
  if (!value) throw new Error('useCountries must be used inside <CountriesProvider>')
  return value
}
