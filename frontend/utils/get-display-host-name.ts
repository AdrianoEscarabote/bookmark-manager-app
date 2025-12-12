export function getDisplayHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
      .replace(/^[a-z]+:\/\//i, '')
      .replace(/^www\./, '')
      .split('/')[0]
  }
}
