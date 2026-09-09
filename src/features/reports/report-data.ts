import { computePaymentStatus, paymentStatusLabel } from '@/features/budget/constants'
import { isTaskOverdue, taskPriorityLabel, taskStatusLabel } from '@/features/tasks/constants'
import type { StatusBarDatum } from '@/features/reports/status-bar-chart'
import type { BudgetItem } from '@/services/budget-items'
import type { Guest } from '@/services/guests'
import type { Task } from '@/services/tasks'
import type { Vendor } from '@/services/vendors'

const SUCCESS = '#4b8a5f'
const WARNING = '#c98a2c'
const DANGER = '#c0433a'

export function guestRsvpChartData(guests: Guest[]): StatusBarDatum[] {
  const sum = (predicate: (g: Guest) => boolean) => guests.filter(predicate).reduce((total, g) => total + g.total_guests, 0)
  return [
    { name: 'Confirmed', value: sum((g) => g.rsvp_status === 'confirmed'), color: SUCCESS },
    { name: 'Pending', value: sum((g) => g.rsvp_status === 'pending'), color: WARNING },
    { name: 'Declined', value: sum((g) => g.rsvp_status === 'declined'), color: DANGER },
  ]
}

export function taskStatusChartData(tasks: Task[]): StatusBarDatum[] {
  const completed = tasks.filter((t) => t.status === 'completed').length
  const overdue = tasks.filter(isTaskOverdue).length
  const pending = tasks.length - completed - tasks.filter((t) => t.status === 'cancelled').length - overdue
  return [
    { name: 'Completed', value: completed, color: SUCCESS },
    { name: 'Pending', value: Math.max(0, pending), color: WARNING },
    { name: 'Overdue', value: overdue, color: DANGER },
  ]
}

export function guestsToCsvRows(guests: Guest[], groupNameById: Map<string, string>) {
  return guests.map((g) => ({
    Name: g.name,
    Group: g.guest_group_id ? groupNameById.get(g.guest_group_id) ?? '' : '',
    Phone: g.phone ?? '',
    Email: g.email ?? '',
    'Total Guests': g.total_guests,
    Children: g.child_count,
    RSVP: g.rsvp_status,
    'Food Preference': g.food_preference ?? '',
    Accommodation: g.accommodation_required ? 'Yes' : 'No',
    Transportation: g.transportation_required ? 'Yes' : 'No',
    Invitation: g.invitation_status,
  }))
}

export function tasksToCsvRows(tasks: Task[]) {
  return tasks.map((t) => ({
    Name: t.name,
    Category: t.category,
    'Assigned To': t.assigned_to ?? '',
    'Due Date': t.due_date ?? '',
    Priority: taskPriorityLabel(t.priority),
    Status: taskStatusLabel(t.status),
    'Estimated Cost': t.estimated_cost ?? '',
    'Actual Cost': t.actual_cost ?? '',
    Overdue: isTaskOverdue(t) ? 'Yes' : 'No',
  }))
}

export function budgetItemsToCsvRows(items: BudgetItem[], categoryNameById: Map<string, string>) {
  return items.map((item) => {
    const effective = item.actual_amount ?? item.planned_amount
    return {
      Description: item.description,
      Category: item.category_id ? categoryNameById.get(item.category_id) ?? '' : '',
      Vendor: item.vendor ?? '',
      Planned: item.planned_amount,
      Actual: effective,
      Paid: item.amount_paid,
      Remaining: effective - item.amount_paid,
      'Payment Status': paymentStatusLabel(computePaymentStatus(item.amount_paid, effective)),
      'Due Date': item.due_date ?? '',
    }
  })
}

export function vendorsToCsvRows(vendors: Vendor[]) {
  return vendors.map((v) => {
    const effective = v.final_amount ?? v.quoted_amount
    return {
      Name: v.name,
      Category: v.category,
      'Contact Person': v.contact_person ?? '',
      Phone: v.phone ?? '',
      Email: v.email ?? '',
      Quoted: v.quoted_amount ?? '',
      Final: v.final_amount ?? '',
      'Advance Paid': v.advance_paid,
      Balance: effective != null ? effective - v.advance_paid : '',
      Rating: v.rating ?? '',
    }
  })
}
