import { useEffect, type ReactNode } from 'react'
import { act, renderHook, screen } from '@testing-library/react'
import { MemoryRouter, useLocation, useNavigate } from 'react-router'
import { useFilters } from './useFilters'

const regions = ['Africa', 'Asia', 'Europe']

let navigate: ReturnType<typeof useNavigate>

function Spy() {
  const nav = useNavigate()
  useEffect(() => {
    navigate = nav
  }, [nav])
  return <output data-testid="search">{useLocation().search}</output>
}

const setup = (initial = '/') =>
  renderHook(() => useFilters(regions, 300), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[initial]}>
        <Spy />
        {children}
      </MemoryRouter>
    ),
  })

const search = () => screen.getByTestId('search').textContent
const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms))

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useFilters', () => {
  it('reads the initial filters from the URL', () => {
    const { result } = setup('/?q=ger&region=Europe')
    expect(result.current.filters).toEqual({ query: 'ger', region: 'Europe' })
  })

  it('ignores an invalid region in the URL', () => {
    const { result } = setup('/?region=Atlantis')
    expect(result.current.filters.region).toBe('')
  })

  it('updates the query immediately but writes the URL after the debounce', () => {
    const { result } = setup()
    act(() => result.current.setQuery('ger'))
    expect(result.current.filters.query).toBe('ger')
    expect(search()).toBe('')
    advance(300)
    expect(search()).toBe('?q=ger')
  })

  it('writes only the last value after rapid typing', () => {
    const { result } = setup()
    act(() => result.current.setQuery('g'))
    advance(100)
    act(() => result.current.setQuery('ge'))
    advance(100)
    act(() => result.current.setQuery('ger'))
    advance(300)
    expect(search()).toBe('?q=ger')
  })

  it('keeps what the user typed while an earlier write lands in the URL', () => {
    const { result } = setup()
    act(() => result.current.setQuery('ger'))
    advance(300)
    act(() => result.current.setQuery('germ'))
    expect(result.current.filters.query).toBe('germ')
  })

  it('does not add history entries while typing (replace)', () => {
    const { result } = setup()
    act(() => result.current.setQuery('ger'))
    advance(300)
    act(() => void navigate(-1))
    expect(search()).toBe('?q=ger')
  })

  it('writes the region immediately, keeps the query, and adds a history entry', () => {
    const { result } = setup('/?q=ger')
    act(() => result.current.setRegion('Europe'))
    expect(search()).toBe('?q=ger&region=Europe')
    expect(result.current.filters.region).toBe('Europe')
    act(() => void navigate(-1))
    expect(search()).toBe('?q=ger')
    expect(result.current.filters.region).toBe('')
  })

  it('removes the region param when set to empty', () => {
    const { result } = setup('/?region=Asia')
    act(() => result.current.setRegion(''))
    expect(search()).toBe('')
  })

  it('syncs the query from external navigation', () => {
    const { result } = setup('/?q=a')
    act(() => void navigate('/?q=b'))
    expect(result.current.filters.query).toBe('b')
  })

  it('cancels a pending debounced write when the URL changes externally', () => {
    const { result } = setup('/?q=a')
    act(() => result.current.setQuery('zzz'))
    act(() => void navigate('/?q=b'))
    advance(300)
    expect(search()).toBe('?q=b')
    expect(result.current.filters.query).toBe('b')
  })

  it('does not write to the URL after unmount', () => {
    const { result, unmount } = setup()
    act(() => result.current.setQuery('ger'))
    unmount()
    advance(300)
    expect(vi.getTimerCount()).toBe(0)
  })
})
