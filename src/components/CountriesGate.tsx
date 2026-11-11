import type { ReactNode } from 'react'
import type { CountriesReady } from '../context/countriesContext'
import { useCountries } from '../context/useCountries'

/** Рисует состояния загрузки и ошибки; дочерняя функция вызывается только с готовыми данными. */
export default function CountriesGate({ children }: { children: (data: CountriesReady) => ReactNode }) {
  const state = useCountries()
  if (state.status === 'loading') {
    return (
      <p role="status" className="p-6">
        Loading…
      </p>
    )
  }
  if (state.status === 'error') {
    return (
      <div role="alert" className="space-y-4 p-6">
        <p>{state.error.message}</p>
        <button
          type="button"
          onClick={state.reload}
          className="rounded-md bg-white px-6 py-2 shadow dark:bg-blue-900"
        >
          Try again
        </button>
      </div>
    )
  }
  return children(state)
}
