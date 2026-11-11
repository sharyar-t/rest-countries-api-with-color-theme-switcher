import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'

/**
 * В SPA смена страницы не сбрасывает фокус и не озвучивается скринридером. После переходов
 * между маршрутами переносим фокус на h1 новой страницы. Смена только query-параметров
 * (поиск, регион) не должна трогать фокус, поэтому следим за pathname.
 */
export default function RouteFocus() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()
  // Сравнение с предыдущим pathname, а не флаг «первый рендер»: так начальная загрузка
  // не получает фокус и в StrictMode, где эффект выполняется дважды.
  const previous = useRef(pathname)

  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    // При POP (кнопки браузера) прокрутку восстанавливает сам браузер
    if (navigationType !== 'POP') window.scrollTo(0, 0)
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true })
  }, [pathname, navigationType])

  return null
}
