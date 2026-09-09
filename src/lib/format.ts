const INDIAN_GROUPING_CURRENCIES = new Set(['INR'])

export function formatCurrency(amount: number, currency: string) {
  const locale = INDIAN_GROUPING_CURRENCIES.has(currency) ? 'en-IN' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(year, month - 1, day),
  )
}

/** Calendar-day difference between today and a `YYYY-MM-DD` date, ignoring time of day. */
export function daysUntil(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)
  const target = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}
