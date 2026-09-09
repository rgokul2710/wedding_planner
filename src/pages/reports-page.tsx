import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlannedVsActualChart } from '@/features/reports/planned-vs-actual-chart'
import {
  budgetItemsToCsvRows,
  guestRsvpChartData,
  guestsToCsvRows,
  taskStatusChartData,
  tasksToCsvRows,
  totalVendorCommitments,
  vendorsToCsvRows,
} from '@/features/reports/report-data'
import { StatusBarChart } from '@/features/reports/status-bar-chart'
import { VendorCommitmentChart } from '@/features/reports/vendor-commitment-chart'
import { useBudgetCategories } from '@/hooks/use-budget-categories'
import { useBudgetItems } from '@/hooks/use-budget-items'
import { useGuestGroups } from '@/hooks/use-guest-groups'
import { useGuests } from '@/hooks/use-guests'
import { useTasks } from '@/hooks/use-tasks'
import { useVendors } from '@/hooks/use-vendors'
import { useWedding } from '@/hooks/use-wedding'
import { downloadCsv } from '@/lib/csv'
import { formatCurrency } from '@/lib/format'

function ReportHeader({ title, onExport }: { title: string; onExport: () => void }) {
  return (
    <CardHeader className="mb-3">
      <CardTitle className="text-base">{title}</CardTitle>
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="size-4" />
        Export CSV
      </Button>
    </CardHeader>
  )
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-cream-25 px-3 py-2.5 dark:border-ink-800 dark:bg-ink-800/60">
      <p className="text-lg font-semibold text-ink-900 dark:text-ink-50">{value}</p>
      <p className="text-xs text-ink-400">{label}</p>
    </div>
  )
}

export function ReportsPage() {
  const { data: wedding } = useWedding()
  const weddingId = wedding!.id
  const { data: tasks, isPending: tasksPending } = useTasks(weddingId)
  const { data: guests, isPending: guestsPending } = useGuests(weddingId)
  const { data: guestGroups, isPending: groupsPending } = useGuestGroups(weddingId)
  const { data: budgetItems, isPending: budgetPending } = useBudgetItems(weddingId)
  const { data: budgetCategories, isPending: categoriesPending } = useBudgetCategories(weddingId)
  const { data: vendors, isPending: vendorsPending } = useVendors(weddingId)

  const isPending = tasksPending || guestsPending || groupsPending || budgetPending || categoriesPending || vendorsPending

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-rose-400" />
      </div>
    )
  }

  const allTasks = tasks ?? []
  const allGuests = guests ?? []
  const allGroups = guestGroups ?? []
  const allBudgetItems = budgetItems ?? []
  const allCategories = budgetCategories ?? []
  const allVendors = vendors ?? []
  const currency = wedding!.currency

  const groupNameById = new Map(allGroups.map((g) => [g.id, g.name]))
  const categoryNameById = new Map(allCategories.map((c) => [c.id, c.name]))

  const totalPlanned = allBudgetItems.reduce((total, item) => total + item.planned_amount, 0)
  const totalActual = allBudgetItems.reduce((total, item) => total + (item.actual_amount ?? item.planned_amount), 0)
  const variance = totalActual - totalPlanned

  const invited = allGuests.reduce((total, g) => total + g.total_guests, 0)

  const totalCommitments = totalVendorCommitments(allVendors)
  const totalAdvancePaid = allVendors.reduce((total, v) => total + v.advance_paid, 0)

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Reports</h1>

      <Card>
        <ReportHeader title="Budget Report" onExport={() => downloadCsv('budget-report.csv', budgetItemsToCsvRows(allBudgetItems, categoryNameById))} />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <StatTile label="Total Planned" value={formatCurrency(totalPlanned, currency)} />
            <StatTile label="Total Actual" value={formatCurrency(totalActual, currency)} />
            <StatTile label={variance > 0 ? 'Over Budget' : 'Under Budget'} value={formatCurrency(Math.abs(variance), currency)} />
          </div>
          <PlannedVsActualChart items={allBudgetItems} categories={allCategories} currency={currency} />
        </CardContent>
      </Card>

      <Card>
        <ReportHeader title="Guest Report" onExport={() => downloadCsv('guest-report.csv', guestsToCsvRows(allGuests, groupNameById))} />
        <CardContent className="space-y-4">
          <StatTile label="Total Invited" value={invited} />
          <StatusBarChart data={guestRsvpChartData(allGuests)} />
        </CardContent>
      </Card>

      <Card>
        <ReportHeader title="Task Report" onExport={() => downloadCsv('task-report.csv', tasksToCsvRows(allTasks))} />
        <CardContent className="space-y-4">
          <StatTile label="Total Tasks" value={allTasks.length} />
          <StatusBarChart data={taskStatusChartData(allTasks)} />
        </CardContent>
      </Card>

      <Card>
        <ReportHeader title="Vendor Report" onExport={() => downloadCsv('vendor-report.csv', vendorsToCsvRows(allVendors))} />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Total Commitments" value={formatCurrency(totalCommitments, currency)} />
            <StatTile label="Total Advance Paid" value={formatCurrency(totalAdvancePaid, currency)} />
          </div>
          <VendorCommitmentChart vendors={allVendors} currency={currency} />
        </CardContent>
      </Card>
    </div>
  )
}
