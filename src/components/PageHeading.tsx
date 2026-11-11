import type { ReactNode } from 'react'

/** Единственный h1 страницы. tabIndex=-1 позволяет переносить на него фокус программно. */
export default function PageHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h1 tabIndex={-1} className={`outline-none ${className}`}>
      {children}
    </h1>
  )
}
