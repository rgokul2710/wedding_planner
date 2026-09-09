import * as React from 'react'
import type { Vendor } from '@/services/vendors'
import type { VendorStatus } from '@/types/database'

export interface VendorFilterState {
  search: string
  category: string
  status: VendorStatus | 'all'
}

const DEFAULT_FILTERS: VendorFilterState = { search: '', category: 'all', status: 'all' }

export function useVendorFilters(vendors: Vendor[]) {
  const [filters, setFilters] = React.useState<VendorFilterState>(DEFAULT_FILTERS)

  function onChange(patch: Partial<VendorFilterState>) {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  const filteredVendors = React.useMemo(() => {
    const search = filters.search.trim().toLowerCase()

    return vendors.filter((vendor) => {
      if (filters.category !== 'all' && vendor.category !== filters.category) return false
      if (filters.status !== 'all' && vendor.status !== filters.status) return false
      if (search) {
        const haystack = `${vendor.name} ${vendor.contact_person ?? ''}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })
  }, [vendors, filters])

  return { filters, onChange, filteredVendors }
}
