import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './themeContext'

const STORAGE_KEY = 'theme'

// Начальную тему уже выставил inline-скрипт в index.html (с учётом localStorage и
// prefers-color-scheme), поэтому читаем её из DOM и не дублируем логику выбора.
const readCurrentTheme = (): Theme =>
  document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readCurrentTheme)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Сохраняем только осознанный выбор пользователя, а не системное значение по умолчанию.
  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // localStorage может быть недоступен (приватный режим, квота): тема просто не сохранится
    }
  }, [theme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeContext value={value}>{children}</ThemeContext>
}
