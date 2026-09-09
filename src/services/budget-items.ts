import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type BudgetItem = Database['public']['Tables']['budget_items']['Row']
type BudgetItemUpdate = Database['public']['Tables']['budget_items']['Update']

export interface BudgetItemInput {
  categoryId: string | null
  description: string
  vendor: string | null
  plannedAmount: number
  actualAmount: number | null
  amountPaid: number
  dueDate: string | null
  notes: string | null
}

export async function listBudgetItems(weddingId: string): Promise<BudgetItem[]> {
  const { data, error } = await supabase.from('budget_items').select('*').eq('wedding_id', weddingId).order('created_at')
  if (error) throw error
  return data
}

export async function createBudgetItem(weddingId: string, userId: string, input: BudgetItemInput): Promise<BudgetItem> {
  const { data, error } = await supabase
    .from('budget_items')
    .insert({
      wedding_id: weddingId,
      created_by: userId,
      category_id: input.categoryId,
      description: input.description,
      vendor: input.vendor,
      planned_amount: input.plannedAmount,
      actual_amount: input.actualAmount,
      amount_paid: input.amountPaid,
      due_date: input.dueDate,
      notes: input.notes,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateBudgetItem(id: string, input: BudgetItemInput): Promise<BudgetItem> {
  const patch: BudgetItemUpdate = {
    category_id: input.categoryId,
    description: input.description,
    vendor: input.vendor,
    planned_amount: input.plannedAmount,
    actual_amount: input.actualAmount,
    amount_paid: input.amountPaid,
    due_date: input.dueDate,
    notes: input.notes,
  }
  const { data, error } = await supabase.from('budget_items').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteBudgetItem(id: string): Promise<void> {
  const { error } = await supabase.from('budget_items').delete().eq('id', id)
  if (error) throw error
}
