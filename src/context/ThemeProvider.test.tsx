import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '../components/ThemeToggle'
import { ThemeProvider } from './ThemeProvider'
import { useTheme } from './useTheme'

const root = document.documentElement
const renderToggle = () =>
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
const button = () => screen.getByRole('button', { name: /^(dark|light) mode$/i })

beforeEach(() => {
  localStorage.clear()
  root.removeAttribute('data-theme')
})
afterEach(() => vi.restoreAllMocks())

describe('ThemeProvider', () => {
  it('takes the initial theme from the data-theme attribute and offers Light Mode', () => {
    root.setAttribute('data-theme', 'dark')
    renderToggle()
    expect(button()).toHaveAccessibleName('Light Mode')
  })

  it('defaults to light when the attribute is missing and offers Dark Mode', () => {
    renderToggle()
    expect(button()).toHaveAccessibleName('Dark Mode')
    expect(root).toHaveAttribute('data-theme', 'light')
  })

  it('describes the action, so it must not expose aria-pressed', () => {
    renderToggle()
    expect(button()).not.toHaveAttribute('aria-pressed')
  })

  it('does not persist anything until the user toggles', () => {
    root.setAttribute('data-theme', 'dark')
    renderToggle()
    expect(localStorage.getItem('theme')).toBeNull()
  })

  it('toggles the attribute, the label and localStorage', async () => {
    root.setAttribute('data-theme', 'light')
    renderToggle()
    await userEvent.click(button())
    expect(root).toHaveAttribute('data-theme', 'dark')
    expect(button()).toHaveAccessibleName('Light Mode')
    expect(localStorage.getItem('theme')).toBe('dark')
    await userEvent.click(button())
    expect(root).toHaveAttribute('data-theme', 'light')
    expect(button()).toHaveAccessibleName('Dark Mode')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('still toggles when localStorage throws', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError')
    })
    renderToggle()
    await userEvent.click(button())
    expect(root).toHaveAttribute('data-theme', 'dark')
  })
})

describe('useTheme', () => {
  function Bare() {
    useTheme()
    return null
  }
  it('throws outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Bare />)).toThrow(/ThemeProvider/)
  })
})
