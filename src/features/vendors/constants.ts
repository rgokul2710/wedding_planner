import type { VendorStatus } from '@/types/database'

export const VENDOR_CATEGORIES = [
  'Venue',
  'Caterer',
  'Photographer',
  'Videographer',
  'Decorator',
  'Makeup',
  'Clothing',
  'Jewellery',
  'Invitation',
  'Transportation',
  'Music',
  'Accommodation',
  'Other',
] as const

export const VENDOR_STATUSES: { value: VendorStatus; label: string }[] = [
  { value: 'considering', label: 'Considering' },
  { value: 'selected', label: 'Selected' },
  { value: 'rejected', label: 'Rejected' },
]

export function vendorStatusLabel(status: VendorStatus) {
  return VENDOR_STATUSES.find((s) => s.value === status)?.label ?? status
}

export function vendorStatusBadgeVariant(status: VendorStatus): 'neutral' | 'gold' | 'danger' {
  switch (status) {
    case 'considering':
      return 'neutral'
    case 'selected':
      return 'gold'
    case 'rejected':
      return 'danger'
  }
}
