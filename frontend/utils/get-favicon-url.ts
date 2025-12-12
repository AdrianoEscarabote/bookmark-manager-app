export function getFaviconUrl(rawUrl: string) {
  const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`
  const hostname = new URL(url).hostname

  return `https://icons.duckduckgo.com/ip3/${hostname}.ico`
}
