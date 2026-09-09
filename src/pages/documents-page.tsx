import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText, Loader2, Plus } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DOCUMENT_CATEGORIES } from '@/features/documents/constants'
import { DocumentForm } from '@/features/documents/document-form'
import { DocumentRow } from '@/features/documents/document-row'
import { useAuth } from '@/hooks/use-auth'
import { documentsQueryKey, useDocuments } from '@/hooks/use-documents'
import { useVendors } from '@/hooks/use-vendors'
import { useWedding } from '@/hooks/use-wedding'
import { deleteDocument, updateDocument, uploadDocument } from '@/services/documents'
import type { Document } from '@/services/documents'

export function DocumentsPage() {
  const { data: wedding } = useWedding()
  const { user } = useAuth()
  const weddingId = wedding!.id
  const { data: documents, isPending: documentsPending } = useDocuments(weddingId)
  const { data: vendors, isPending: vendorsPending } = useVendors(weddingId)
  const queryClient = useQueryClient()

  const [formOpen, setFormOpen] = React.useState(false)
  const [editingDocument, setEditingDocument] = React.useState<Document | undefined>(undefined)
  const [deletingDocument, setDeletingDocument] = React.useState<Document | null>(null)
  const [categoryFilter, setCategoryFilter] = React.useState('all')

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: documentsQueryKey(weddingId) })
  }

  const uploadMutation = useMutation({
    mutationFn: ({ input, file }: { input: Parameters<typeof uploadDocument>[3]; file: File }) =>
      uploadDocument(weddingId, user!.id, file, input),
    onSuccess: () => {
      invalidate()
      setFormOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (input: Parameters<typeof updateDocument>[1]) => updateDocument(editingDocument!.id, input),
    onSuccess: () => {
      invalidate()
      setFormOpen(false)
      setEditingDocument(undefined)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (document: Document) => deleteDocument(document),
    onSuccess: () => {
      invalidate()
      setDeletingDocument(null)
    },
  })

  function openCreateForm() {
    setEditingDocument(undefined)
    setFormOpen(true)
  }

  function openEditForm(document: Document) {
    setEditingDocument(document)
    setFormOpen(true)
  }

  if (documentsPending || vendorsPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-rose-400" />
      </div>
    )
  }

  const allDocuments = documents ?? []
  const allVendors = vendors ?? []
  const vendorNameById = new Map(allVendors.map((v) => [v.id, v.name]))
  const hasNoDocumentsAtAll = allDocuments.length === 0
  const visibleDocuments = categoryFilter === 'all' ? allDocuments : allDocuments.filter((d) => d.category === categoryFilter)

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Documents</h1>
        <Button onClick={openCreateForm}>
          <Plus className="size-4" />
          Upload Document
        </Button>
      </div>

      {hasNoDocumentsAtAll ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Store vendor quotations, contracts, bills, and receipts here."
          action={
            <Button onClick={openCreateForm}>
              <Plus className="size-4" />
              Upload Document
            </Button>
          }
        />
      ) : (
        <>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {DOCUMENT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {visibleDocuments.length === 0 ? (
            <EmptyState icon={FileText} title="No documents in this category" description="Try a different category filter." />
          ) : (
            <div className="space-y-3">
              {visibleDocuments.map((document) => (
                <DocumentRow
                  key={document.id}
                  document={document}
                  vendorName={document.vendor_id ? vendorNameById.get(document.vendor_id) : undefined}
                  onEdit={openEditForm}
                  onDelete={setDeletingDocument}
                />
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDocument ? 'Edit Document' : 'Upload Document'}</DialogTitle>
          </DialogHeader>
          <DocumentForm
            document={editingDocument}
            vendors={allVendors}
            onCancel={() => setFormOpen(false)}
            onSubmit={(input, file) =>
              editingDocument ? updateMutation.mutateAsync(input) : uploadMutation.mutateAsync({ input, file: file! })
            }
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingDocument)}
        onOpenChange={(open) => !open && setDeletingDocument(null)}
        title="Delete this document?"
        description={`"${deletingDocument?.name}" will be permanently removed from storage. This can't be undone.`}
        confirmLabel="Delete Document"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deletingDocument && deleteMutation.mutate(deletingDocument)}
      />
    </div>
  )
}
