import { formatDate } from '@/lib/format'

interface CountdownHeroProps {
  brideName: string
  groomName: string
  weddingDate: string
  daysUntil: number
}

export function CountdownHero({ brideName, groomName, weddingDate, daysUntil }: CountdownHeroProps) {
  const message =
    daysUntil > 0
      ? `${daysUntil} Day${daysUntil === 1 ? '' : 's'} Until Our Wedding`
      : daysUntil === 0
        ? 'Today Is The Day'
        : `Married For ${Math.abs(daysUntil)} Day${Math.abs(daysUntil) === 1 ? '' : 's'}`

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 px-6 py-8 text-cream-25 shadow-soft-lg sm:px-10 sm:py-10">
      <p className="text-sm font-medium text-rose-100">
        {brideName} &amp; {groomName}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{message} ❤️</h1>
      <p className="mt-2 text-sm text-rose-100">{formatDate(weddingDate)}</p>
    </div>
  )
}
