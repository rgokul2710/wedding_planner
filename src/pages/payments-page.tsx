import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreditCard, Loader2, Plus } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PAYMENT_STATUSES, isPaymentOverdue } from '@/features/payments/constants'
import { PaymentForm } from '@/features/payments/payment-form'
import { PaymentRow } from '@/features/payments/payment-row'
import { useAuth } from '@/hooks/use-auth'
import { paymentsQueryKey, usePayments } from '@/hooks/use-payments'
import { useWedding } from '@/hooks/use-wedding'
import { createPayment, deletePayment, updatePayment } from '@/services/payments'
import type { Payment } from '@/services/payments'

type StatusFilter = 'all' | 'overdue' | Payment['payment_status']

export function PaymentsPage() {
  const { data: wedding } = useWedding()
  const { user } = useAuth()
  const weddingId = wedding!.id
  const { data: payments, isPending } = usePayments(weddingId)
  const queryClient = useQueryClient()

  const [formOpen, setFormOpen] = React.useState(false)
  const [editingPayment, setEditingPayment] = React.useState<Payment | undefined>(undefined)
  const [deletingPayment, setDeletingPayment] = React.useState<Payment | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all')

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: paymentsQueryKey(weddingId) })
  }

  const createMutation = useMutation({
    mutationFn: (input: Parameters<typeof createPayment>[2]) => createPayment(weddingId, user!.id, input),
    onSuccess: () => {
      invalidate()
      setFormOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (input: Parameters<typeof updatePayment>[1]) => updatePayment(editingPayment!.id, input),
    onSuccess: () => {
      invalidate()
      setFormOpen(false)
      setEditingPayment(undefined)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (payment: Payment) => deletePayment(payment.id),
    onSuccess: () => {
      invalidate()
      setDeletingPayment(null)
    },
  })

  function openCreateForm() {
    setEditingPayment(undefined)
    setFormOpen(true)
  }

  function openEditForm(payment: Payment) {
    setEditingPayment(payment)
    setFormOpen(true)
  }

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-rose-400" />
      </div>
    )
  }

  const allPayments = payments ?? []
  const hasNoPaymentsAtAll = allPayments.length === 0
  const visiblePayments = allPayments.filter((p) => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'overdue') return isPaymentOverdue(p.due_date, p.payment_status)
    return p.payment_status === statusFilter
  })

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Payments</h1>
        <Button onClick={openCreateForm}>
          <Plus className="size-4" />
          Add Payment
        </Button>
      </div>

      {hasNoPaymentsAtAll ? (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="Track every payment to a vendor, with due dates so nothing slips through."
          action={
            <Button onClick={openCreateForm}>
              <Plus className="size-4" />
              Add Payment
            </Button>
          }
        />
      ) : (
        <>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              {PAYMENT_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {visiblePayments.length === 0 ? (
            <EmptyState icon={CreditCard} title="No payments match this filter" description="Try a different filter above." />
          ) : (
            <div className="space-y-3">
              {visiblePayments.map((payment) => (
                <PaymentRow
                  key={payment.id}
                  payment={payment}
                  currency={wedding!.currency}
                  onEdit={openEditForm}
                  onDelete={setDeletingPayment}
                />
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPayment ? 'Edit Payment' : 'Add Payment'}</DialogTitle>
          </DialogHeader>
          <PaymentForm
            payment={editingPayment}
            onCancel={() => setFormOpen(false)}
            onSubmit={(input) => (editingPayment ? updateMutation.mutateAsync(input) : createMutation.mutateAsync(input))}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingPayment)}
        onOpenChange={(open) => !open && setDeletingPayment(null)}
        title="Delete this payment?"
        description={`"${deletingPayment?.description}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete Payment"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deletingPayment && deleteMutation.mutate(deletingPayment)}
      />
    </div>
  )
}
