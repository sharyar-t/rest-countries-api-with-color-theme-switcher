import { Link } from 'react-router'
import PageHeading from '../components/PageHeading'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <div className="space-y-4 p-6">
      <PageHeading className="text-2xl font-extrabold">Page not found</PageHeading>
      <Link to="/" className="underline">
        Back to all countries
      </Link>
    </div>
  )
}
