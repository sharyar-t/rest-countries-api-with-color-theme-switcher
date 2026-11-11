const OLD_HOST = 'flagcdn.com'
const NEW_HOST = 'flagcdn.io'

/** Переводит ссылку на флаг со старого хоста на новый; остальные ссылки не трогает. */
export function withFlagHost(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== OLD_HOST) return url
    parsed.hostname = NEW_HOST
    return parsed.toString()
  } catch {
    return url
  }
}
