export function formatDayMonth(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
  }).format(d)
}
