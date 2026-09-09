import * as React from 'react'
import { CurrencyBarChart } from '@/components/charts/currency-bar-chart'
import type { Vendor } from '@/services/vendors'

export function VendorCommitmentChart({ vendors, currency }: { vendors: Vendor[]; currency: string }) {
  const data = React.useMemo(() => {
    const totals = new Map<string, number>()
    for (const vendor of vendors) {
      const effective = vendor.final_amount ?? vendor.quoted_amount ?? 0
      totals.set(vendor.category, (totals.get(vendor.category) ?? 0) + effective)
    }
    return Array.from(totals.entries())
      .map(([name, value]) => ({ name, value }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [vendors])

  return <CurrencyBarChart data={data} currency={currency} emptyMessage="Add quoted or final amounts to see commitments by category." />
}
