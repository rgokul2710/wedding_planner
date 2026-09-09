import type { BudgetPaymentStatus } from '@/types/database'

export function computePaymentStatus(amountPaid: number, effectiveAmount: number): BudgetPaymentStatus {
  if (amountPaid <= 0) return 'not_paid'
  if (amountPaid >= effectiveAmount) return 'fully_paid'
  return 'partially_paid'
}

export function paymentStatusLabel(status: BudgetPaymentStatus) {
  switch (status) {
    case 'not_paid':
      return 'Not Paid'
    case 'partially_paid':
      return 'Partially Paid'
    case 'fully_paid':
      return 'Fully Paid'
  }
}

export function paymentStatusBadgeVariant(status: BudgetPaymentStatus): 'neutral' | 'warning' | 'success' {
  switch (status) {
    case 'not_paid':
      return 'neutral'
    case 'partially_paid':
      return 'warning'
    case 'fully_paid':
      return 'success'
  }
}
