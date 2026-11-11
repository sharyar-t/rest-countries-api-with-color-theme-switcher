export const SITE_TITLE = 'Where in the world?'

export const formatTitle = (page?: string): string => (page ? `${page} – ${SITE_TITLE}` : SITE_TITLE)
