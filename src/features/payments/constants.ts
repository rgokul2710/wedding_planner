import type { BudgetPaymentStatus, PaymentMethod } from '@/types/database'

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Card' },
  { value: 'other', label: 'Other' },
]

export const PAYMENT_STATUSES: { value: BudgetPaymentStatus; label: string }[] = [
  { value: 'not_paid', label: 'Not Paid' },
  { value: 'partially_paid', label: 'Partially Paid' },
  { value: 'fully_paid', label: 'Fully Paid' },
]

export function paymentMethodLabel(method: PaymentMethod | null) {
  if (!method) return '—'
  return PAYMENT_METHODS.find((m) => m.value === method)?.label ?? method
}

export function isPaymentOverdue(dueDate: string | null, status: BudgetPaymentStatus) {
  if (!dueDate || status === 'fully_paid') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [year, month, day] = dueDate.split('-').map(Number)
  return new Date(year, month - 1, day).getTime() < today.getTime()
}
