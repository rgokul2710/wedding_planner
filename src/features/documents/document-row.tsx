import { Download, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatFileSize } from '@/features/documents/constants'
import { formatDate } from '@/lib/format'
import { getSignedUrl } from '@/lib/storage'
import type { Document } from '@/services/documents'

interface DocumentRowProps {
  document: Document
  vendorName?: string
  onEdit: (document: Document) => void
  onDelete: (document: Document) => void
}

export function DocumentRow({ document, vendorName, onEdit, onDelete }: DocumentRowProps) {
  const [opening, setOpening] = React.useState(false)

  async function handleOpen() {
    setOpening(true)
    try {
      const url = await getSignedUrl('documents', document.storage_path)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      toast.error("Couldn't open this document. Please try again.")
    } finally {
      setOpening(false)
    }
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-cream-25 p-4 shadow-soft dark:border-ink-800 dark:bg-ink-800/60">
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <button type="button" onClick={handleOpen} disabled={opening} className="text-left font-medium text-ink-800 hover:text-rose-600 dark:text-ink-100">
            {document.name}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleOpen}>
                <Download className="size-4" />
                View / Download
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEdit(document)}>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete(document)} className="text-danger-500">
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{document.category}</Badge>
          {vendorName && <Badge variant="rose">{vendorName}</Badge>}
          <span className="text-xs text-ink-400">
            {formatFileSize(document.file_size)} · {formatDate(document.created_at.slice(0, 10))}
          </span>
        </div>

        {document.notes && <p className="mt-1.5 text-sm text-ink-400">{document.notes}</p>}
      </div>
    </div>
  )
}
