import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { VENDOR_CATEGORIES } from '@/features/vendors/constants'
import type { VendorFilterState } from '@/features/vendors/use-vendor-filters'

interface VendorFiltersProps {
  filters: VendorFilterState
  onChange: (patch: Partial<VendorFilterState>) => void
}

export function VendorFilters({ filters, onChange }: VendorFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
        <Input
          placeholder="Search vendors…"
          className="pl-9"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      <Select value={filters.category} onValueChange={(value) => onChange({ category: value })}>
        <SelectTrigger className="w-44 shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {VENDOR_CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
