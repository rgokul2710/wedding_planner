import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { WeddingEvent } from '@/services/events'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function buildMonthGrid(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1)
  const start = new Date(firstOfMonth)
  start.setDate(start.getDate() - start.getDay())

  const days: Date[] = []
  const cursor = new Date(start)
  while (days.length < 42) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

interface EventCalendarProps {
  events: WeddingEvent[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
}

export function EventCalendar({ events, selectedDate, onSelectDate }: EventCalendarProps) {
  const today = new Date()
  const [visibleMonth, setVisibleMonth] = React.useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const eventCountByDate = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const event of events) {
      counts.set(event.event_date, (counts.get(event.event_date) ?? 0) + 1)
    }
    return counts
  }, [events])

  const days = React.useMemo(() => buildMonthGrid(visibleMonth.getFullYear(), visibleMonth.getMonth()), [visibleMonth])
  const todayKey = toDateKey(today)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">
          {visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink-400">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = toDateKey(day)
          const inCurrentMonth = day.getMonth() === visibleMonth.getMonth()
          const count = eventCountByDate.get(key) ?? 0
          const isToday = key === todayKey
          const isSelected = key === selectedDate

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(key)}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-lg py-2 text-sm transition-colors',
                inCurrentMonth ? 'text-ink-700 dark:text-ink-200' : 'text-ink-200 dark:text-ink-700',
                isSelected ? 'bg-rose-500 text-cream-25' : 'hover:bg-cream-100 dark:hover:bg-ink-700',
                isToday && !isSelected && 'font-semibold text-rose-500',
              )}
            >
              {day.getDate()}
              {count > 0 && (
                <span className={cn('size-1.5 rounded-full', isSelected ? 'bg-cream-25' : 'bg-rose-500')} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
