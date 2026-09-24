export function formatCurrency(amount: string | number): string {
  const n = typeof amount === 'string' ? parseInt(amount, 10) : amount
  if (isNaN(n)) return '—\u00a0XAF'
  return new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(n) + '\u00a0XAF'
}

export function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Africa/Douala', year: 'numeric', month: 'short',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso))
  } catch { return iso }
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Africa/Douala', year: 'numeric', month: 'short', day: 'numeric',
    }).format(new Date(iso))
  } catch { return iso }
}

export function toLocalDateString(date: Date): string {
  return new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'Africa/Douala', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(date)
}

export function formatRelative(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const rtf = new Intl.RelativeTimeFormat('fr-FR', { numeric: 'auto' })
    const MIN = 60_000, HOUR = 3_600_000, DAY = 86_400_000
    if (diff < MIN) return "à l'instant"
    if (diff < HOUR) return rtf.format(-Math.floor(diff / MIN), 'minute')
    if (diff < DAY) return rtf.format(-Math.floor(diff / HOUR), 'hour')
    return rtf.format(-Math.floor(diff / DAY), 'day')
  } catch { return '' }
}

export function formatQuantity(quantity: number, unit: string): string {
  const n = new Intl.NumberFormat('fr-FR').format(quantity)
  const labels: Record<string, [string, string]> = {
    PIECE: ['pièce', 'pièces'], BOX: ['boîte', 'boîtes'], CARTON: ['carton', 'cartons'],
  }
  const [s, p] = labels[unit] ?? [unit, unit]
  return `${n}\u00a0${quantity <= 1 ? s : p}`
}

export function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : String(delta)
}
