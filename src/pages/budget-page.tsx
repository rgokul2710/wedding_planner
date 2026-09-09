import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, Wallet } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BudgetItemForm } from '@/features/budget/budget-item-form'
import { BudgetItemRow } from '@/features/budget/budget-item-row'
import { BudgetTotals } from '@/features/budget/budget-totals'
import { CategorySpendChart } from '@/features/budget/category-spend-chart'
import { useAuth } from '@/hooks/use-auth'
import { budgetCategoriesQueryKey, useBudgetCategories } from '@/hooks/use-budget-categories'
import { budgetItemsQueryKey, useBudgetItems } from '@/hooks/use-budget-items'
import { useWedding } from '@/hooks/use-wedding'
import { createBudgetItem, deleteBudgetItem, updateBudgetItem } from '@/services/budget-items'
import type { BudgetItem } from '@/services/budget-items'

export function BudgetPage() {
  const { data: wedding } = useWedding()
  const { user } = useAuth()
  const weddingId = wedding!.id
  const { data: items, isPending: itemsPending } = useBudgetItems(weddingId)
  const { data: categories, isPending: categoriesPending } = useBudgetCategories(weddingId)
  const queryClient = useQueryClient()

  const [formOpen, setFormOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<BudgetItem | undefined>(undefined)
  const [deletingItem, setDeletingItem] = React.useState<BudgetItem | null>(null)
  const [categoryFilter, setCategoryFilter] = React.useState('all')

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: budgetItemsQueryKey(weddingId) })
    queryClient.invalidateQueries({ queryKey: budgetCategoriesQueryKey(weddingId) })
  }

  const createMutation = useMutation({
    mutationFn: (input: Parameters<typeof createBudgetItem>[2]) => createBudgetItem(weddingId, user!.id, input),
    onSuccess: () => {
      invalidate()
      setFormOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (input: Parameters<typeof updateBudgetItem>[1]) => updateBudgetItem(editingItem!.id, input),
    onSuccess: () => {
      invalidate()
      setFormOpen(false)
      setEditingItem(undefined)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (item: BudgetItem) => deleteBudgetItem(item.id),
    onSuccess: () => {
      invalidate()
      setDeletingItem(null)
    },
  })

  function openCreateForm() {
    setEditingItem(undefined)
    setFormOpen(true)
  }

  function openEditForm(item: BudgetItem) {
    setEditingItem(item)
    setFormOpen(true)
  }

  if (itemsPending || categoriesPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-rose-400" />
      </div>
    )
  }

  const allItems = items ?? []
  const allCategories = categories ?? []
  const categoryNameById = new Map(allCategories.map((c) => [c.id, c.name]))
  const hasNoItemsAtAll = allItems.length === 0
  const visibleItems = categoryFilter === 'all' ? allItems : allItems.filter((i) => i.category_id === categoryFilter)

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Budget</h1>
        <Button onClick={openCreateForm}>
          <Plus className="size-4" />
          Add Budget Item
        </Button>
      </div>

      {hasNoItemsAtAll ? (
        <EmptyState
          icon={Wallet}
          title="No budget items yet"
          description="Break your budget down by vendor or category to track planned vs. actual spend."
          action={
            <Button onClick={openCreateForm}>
              <Plus className="size-4" />
              Add Budget Item
            </Button>
          }
        />
      ) : (
        <>
          <BudgetTotals items={allItems} currency={wedding!.currency} />

          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <CategorySpendChart items={allItems} categories={allCategories} currency={wedding!.currency} />
            </CardContent>
          </Card>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {visibleItems.length === 0 ? (
            <EmptyState icon={Wallet} title="No items in this category" description="Try a different category filter." />
          ) : (
            <div className="space-y-3">
              {visibleItems.map((item) => (
                <BudgetItemRow
                  key={item.id}
                  item={item}
                  categoryName={item.category_id ? categoryNameById.get(item.category_id) : undefined}
                  currency={wedding!.currency}
                  onEdit={openEditForm}
                  onDelete={setDeletingItem}
                />
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Budget Item' : 'Add Budget Item'}</DialogTitle>
          </DialogHeader>
          <BudgetItemForm
            item={editingItem}
            categories={allCategories}
            onCancel={() => setFormOpen(false)}
            onSubmit={(input) => (editingItem ? updateMutation.mutateAsync(input) : createMutation.mutateAsync(input))}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingItem)}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        title="Delete this budget item?"
        description={`"${deletingItem?.description}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete Item"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deletingItem && deleteMutation.mutate(deletingItem)}
      />
    </div>
  )
}
