import { useEffect } from 'react'
import { formatTitle } from '../lib/title'

/** Заголовок вкладки и истории: «Germany – Where in the world?». Без аргумента — название сайта. */
export function useDocumentTitle(page?: string) {
  useEffect(() => {
    document.title = formatTitle(page)
  }, [page])
}
