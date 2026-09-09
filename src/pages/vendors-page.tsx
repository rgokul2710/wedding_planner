import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, Store } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { VendorFilters } from '@/features/vendors/vendor-filters'
import { VendorForm } from '@/features/vendors/vendor-form'
import { VendorRow } from '@/features/vendors/vendor-row'
import { useVendorFilters } from '@/features/vendors/use-vendor-filters'
import { useAuth } from '@/hooks/use-auth'
import { useWedding } from '@/hooks/use-wedding'
import { useVendors, vendorsQueryKey } from '@/hooks/use-vendors'
import { createVendor, deleteVendor, updateVendor } from '@/services/vendors'
import type { Vendor } from '@/services/vendors'

export function VendorsPage() {
  const { data: wedding } = useWedding()
  const { user } = useAuth()
  const weddingId = wedding!.id
  const { data: vendors, isPending } = useVendors(weddingId)
  const queryClient = useQueryClient()

  const [formOpen, setFormOpen] = React.useState(false)
  const [editingVendor, setEditingVendor] = React.useState<Vendor | undefined>(undefined)
  const [deletingVendor, setDeletingVendor] = React.useState<Vendor | null>(null)

  const { filters, onChange, filteredVendors } = useVendorFilters(vendors ?? [])

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: vendorsQueryKey(weddingId) })
  }

  const createMutation = useMutation({
    mutationFn: (input: Parameters<typeof createVendor>[2]) => createVendor(weddingId, user!.id, input),
    onSuccess: () => {
      invalidate()
      setFormOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (input: Parameters<typeof updateVendor>[1]) => updateVendor(editingVendor!.id, input),
    onSuccess: () => {
      invalidate()
      setFormOpen(false)
      setEditingVendor(undefined)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (vendor: Vendor) => deleteVendor(vendor.id),
    onSuccess: () => {
      invalidate()
      setDeletingVendor(null)
    },
  })

  function openCreateForm() {
    setEditingVendor(undefined)
    setFormOpen(true)
  }

  function openEditForm(vendor: Vendor) {
    setEditingVendor(vendor)
    setFormOpen(true)
  }

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-rose-400" />
      </div>
    )
  }

  const hasNoVendorsAtAll = (vendors ?? []).length === 0

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Vendors</h1>
        <Button onClick={openCreateForm}>
          <Plus className="size-4" />
          Add Vendor
        </Button>
      </div>

      {hasNoVendorsAtAll ? (
        <EmptyState
          icon={Store}
          title="No vendors yet"
          description="Keep every vendor's contact details, quotes, and contracts organized in one place."
          action={
            <Button onClick={openCreateForm}>
              <Plus className="size-4" />
              Add Vendor
            </Button>
          }
        />
      ) : (
        <>
          <VendorFilters filters={filters} onChange={onChange} />

          {filteredVendors.length === 0 ? (
            <EmptyState icon={Store} title="No vendors match your filters" description="Try adjusting the search or category filter above." />
          ) : (
            <div className="space-y-3">
              {filteredVendors.map((vendor) => (
                <VendorRow
                  key={vendor.id}
                  vendor={vendor}
                  currency={wedding!.currency}
                  onEdit={openEditForm}
                  onDelete={setDeletingVendor}
                />
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
          </DialogHeader>
          <VendorForm
            vendor={editingVendor}
            onCancel={() => setFormOpen(false)}
            onSubmit={(input) => (editingVendor ? updateMutation.mutateAsync(input) : createMutation.mutateAsync(input))}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingVendor)}
        onOpenChange={(open) => !open && setDeletingVendor(null)}
        title="Delete this vendor?"
        description={`"${deletingVendor?.name}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete Vendor"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deletingVendor && deleteMutation.mutate(deletingVendor)}
      />
    </div>
  )
}
