import { useTheme } from '../context/useTheme'

const iconClass = 'size-4 fill-none stroke-current stroke-2'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  // Подпись описывает действие, а не состояние, поэтому aria-pressed здесь не нужен
  return (
    <button type="button" onClick={toggleTheme} className="inline-flex items-center gap-2 font-semibold">
      {isDark ? <SunIcon /> : <MoonIcon />}
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
    </svg>
  )
}
