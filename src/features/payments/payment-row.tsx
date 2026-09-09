import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { paymentStatusBadgeVariant, paymentStatusLabel } from '@/features/budget/constants'
import { isPaymentOverdue, paymentMethodLabel } from '@/features/payments/constants'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Payment } from '@/services/payments'

interface PaymentRowProps {
  payment: Payment
  currency: string
  onEdit: (payment: Payment) => void
  onDelete: (payment: Payment) => void
}

export function PaymentRow({ payment, currency, onEdit, onDelete }: PaymentRowProps) {
  const overdue = isPaymentOverdue(payment.due_date, payment.payment_status)

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-cream-25 p-4 shadow-soft dark:border-ink-800 dark:bg-ink-800/60">
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-ink-800 dark:text-ink-100">{payment.description}</p>
            {payment.vendor && <p className="text-xs text-ink-400">{payment.vendor}</p>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(payment)}>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete(payment)} className="text-danger-500">
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-ink-800 dark:text-ink-100">{formatCurrency(payment.amount, currency)}</span>
          <Badge variant={paymentStatusBadgeVariant(payment.payment_status)}>{paymentStatusLabel(payment.payment_status)}</Badge>
          {payment.payment_method && <Badge variant="neutral">{paymentMethodLabel(payment.payment_method)}</Badge>}
          {payment.due_date && (
            <span className={cn('text-xs font-medium', overdue ? 'text-danger-500' : 'text-ink-400')}>
              {overdue ? 'Overdue · ' : 'Due '}
              {formatDate(payment.due_date)}
            </span>
          )}
        </div>

        {payment.reference_id && <p className="mt-1.5 text-xs text-ink-400">Ref: {payment.reference_id}</p>}
      </div>
    </div>
  )
}
