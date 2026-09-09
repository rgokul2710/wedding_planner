import * as React from 'react'
import type { Vendor } from '@/services/vendors'

export interface VendorFilterState {
  search: string
  category: string
}

const DEFAULT_FILTERS: VendorFilterState = { search: '', category: 'all' }

export function useVendorFilters(vendors: Vendor[]) {
  const [filters, setFilters] = React.useState<VendorFilterState>(DEFAULT_FILTERS)

  function onChange(patch: Partial<VendorFilterState>) {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  const filteredVendors = React.useMemo(() => {
    const search = filters.search.trim().toLowerCase()

    return vendors.filter((vendor) => {
      if (filters.category !== 'all' && vendor.category !== filters.category) return false
      if (search) {
        const haystack = `${vendor.name} ${vendor.contact_person ?? ''}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })
  }, [vendors, filters])

  return { filters, onChange, filteredVendors }
}
