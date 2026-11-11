import { Link, Route, Routes } from 'react-router'
import RouteFocus from './components/RouteFocus'
import ThemeToggle from './components/ThemeToggle'
import { CountriesProvider } from './context/CountriesProvider'
import { ThemeProvider } from './context/ThemeProvider'
import CountryPage from './pages/CountryPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <ThemeProvider>
      <CountriesProvider>
        <RouteFocus />
        <header className="flex items-center justify-between bg-white px-4 py-6 shadow dark:bg-blue-900">
          <Link to="/" className="text-lg font-extrabold">
            Where in the world?
          </Link>
          <ThemeToggle />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/country/:code" element={<CountryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </CountriesProvider>
    </ThemeProvider>
  )
}
