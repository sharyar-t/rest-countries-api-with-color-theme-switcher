import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import type { CountryFilters } from '../lib/filterCountries'
import { parseFilters, serializeFilters } from '../lib/filtersUrl'

/**
 * Фильтры списка стран. Источник истины для региона — URL. Запрос живёт в локальном
 * состоянии (поле ввода должно быть отзывчивым) и записывается в URL с задержкой,
 * через replace, чтобы набор текста не засорял историю браузера.
 */
export function useFilters(validRegions: readonly string[], debounceMs = 300) {
  const [params, setParams] = useSearchParams()
  const url = parseFilters(params, validRegions)

  const [query, setQueryState] = useState(url.query)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  // Значение q, которое мы сами только что записали в URL: отличает «эхо» нашей записи
  // от внешней навигации (кнопки «назад»/«вперёд», ссылка).
  const lastWritten = useRef<string | null>(null)

  useEffect(() => {
    if (lastWritten.current === url.query) {
      lastWritten.current = null
      return
    }
    lastWritten.current = null
    clearTimeout(timer.current)
    setQueryState(url.query)
  }, [url.query])

  useEffect(() => () => clearTimeout(timer.current), [])

  const setQuery = useCallback(
    (next: string) => {
      setQueryState(next)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        lastWritten.current = next.trim() ? next : ''
        setParams(serializeFilters({ query: next, region: url.region }), { replace: true })
      }, debounceMs)
    },
    [debounceMs, setParams, url.region],
  )

  const setRegion = useCallback(
    (next: string) => {
      clearTimeout(timer.current)
      lastWritten.current = query.trim() ? query : ''
      setParams(serializeFilters({ query, region: next }))
    },
    [query, setParams],
  )

  const filters: Required<CountryFilters> = { query, region: url.region }
  return { filters, setQuery, setRegion }
}
