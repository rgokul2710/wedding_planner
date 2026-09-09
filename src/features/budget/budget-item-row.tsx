import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { computePaymentStatus, paymentStatusBadgeVariant, paymentStatusLabel } from '@/features/budget/constants'
import { formatCurrency, formatDate } from '@/lib/format'
import type { BudgetItem } from '@/services/budget-items'

interface BudgetItemRowProps {
  item: BudgetItem
  categoryName?: string
  currency: string
  onEdit: (item: BudgetItem) => void
  onDelete: (item: BudgetItem) => void
}

export function BudgetItemRow({ item, categoryName, currency, onEdit, onDelete }: BudgetItemRowProps) {
  const effectiveAmount = item.actual_amount ?? item.planned_amount
  const remaining = effectiveAmount - item.amount_paid
  const status = computePaymentStatus(item.amount_paid, effectiveAmount)

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-cream-25 p-4 shadow-soft dark:border-ink-800 dark:bg-ink-800/60">
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-ink-800 dark:text-ink-100">{item.description}</p>
            {item.vendor && <p className="text-xs text-ink-400">{item.vendor}</p>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(item)}>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete(item)} className="text-danger-500">
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {categoryName && <Badge variant="neutral">{categoryName}</Badge>}
          <Badge variant={paymentStatusBadgeVariant(status)}>{paymentStatusLabel(status)}</Badge>
          {item.due_date && <span className="text-xs text-ink-400">Due {formatDate(item.due_date)}</span>}
        </div>

        <dl className="mt-3 grid grid-cols-4 gap-2 text-xs">
          <div>
            <dt className="text-ink-400">Planned</dt>
            <dd className="font-medium text-ink-800 dark:text-ink-100">{formatCurrency(item.planned_amount, currency)}</dd>
          </div>
          <div>
            <dt className="text-ink-400">Actual</dt>
            <dd className="font-medium text-ink-800 dark:text-ink-100">{formatCurrency(effectiveAmount, currency)}</dd>
          </div>
          <div>
            <dt className="text-ink-400">Paid</dt>
            <dd className="font-medium text-success-500">{formatCurrency(item.amount_paid, currency)}</dd>
          </div>
          <div>
            <dt className="text-ink-400">Remaining</dt>
            <dd className={`font-medium ${remaining > 0 ? 'text-danger-500' : 'text-ink-800 dark:text-ink-100'}`}>
              {formatCurrency(remaining, currency)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
