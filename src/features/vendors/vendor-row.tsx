import { Globe, Mail, MoreVertical, Pencil, Phone, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StarRating } from '@/components/ui/star-rating'
import { formatCurrency } from '@/lib/format'
import type { Vendor } from '@/services/vendors'

interface VendorRowProps {
  vendor: Vendor
  currency: string
  onEdit: (vendor: Vendor) => void
  onDelete: (vendor: Vendor) => void
}

export function VendorRow({ vendor, currency, onEdit, onDelete }: VendorRowProps) {
  const effectiveAmount = vendor.final_amount ?? vendor.quoted_amount
  const balance = effectiveAmount != null ? effectiveAmount - vendor.advance_paid : null

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-cream-25 p-4 shadow-soft dark:border-ink-800 dark:bg-ink-800/60">
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-ink-800 dark:text-ink-100">{vendor.name}</p>
            {vendor.contact_person && <p className="text-xs text-ink-400">{vendor.contact_person}</p>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(vendor)}>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete(vendor)} className="text-danger-500">
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{vendor.category}</Badge>
          {vendor.rating != null && <StarRating value={vendor.rating} size="sm" />}
        </div>

        {(vendor.phone || vendor.email || vendor.website) && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-400">
            {vendor.phone && (
              <span className="flex items-center gap-1">
                <Phone className="size-3.5" /> {vendor.phone}
              </span>
            )}
            {vendor.email && (
              <span className="flex items-center gap-1">
                <Mail className="size-3.5" /> {vendor.email}
              </span>
            )}
            {vendor.website && (
              <a
                href={vendor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-rose-500 hover:text-rose-600"
              >
                <Globe className="size-3.5" /> Website
              </a>
            )}
          </div>
        )}

        {(vendor.quoted_amount != null || vendor.final_amount != null) && (
          <dl className="mt-3 grid grid-cols-4 gap-2 text-xs">
            <div>
              <dt className="text-ink-400">Quoted</dt>
              <dd className="font-medium text-ink-800 dark:text-ink-100">
                {vendor.quoted_amount != null ? formatCurrency(vendor.quoted_amount, currency) : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-ink-400">Final</dt>
              <dd className="font-medium text-ink-800 dark:text-ink-100">
                {vendor.final_amount != null ? formatCurrency(vendor.final_amount, currency) : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-ink-400">Advance Paid</dt>
              <dd className="font-medium text-success-500">{formatCurrency(vendor.advance_paid, currency)}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Balance</dt>
              <dd className={`font-medium ${balance != null && balance > 0 ? 'text-danger-500' : 'text-ink-800 dark:text-ink-100'}`}>
                {balance != null ? formatCurrency(balance, currency) : '—'}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  )
}
