import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type BudgetCategory = Database['public']['Tables']['budget_categories']['Row']

export async function listBudgetCategories(weddingId: string): Promise<BudgetCategory[]> {
  const { data, error } = await supabase.from('budget_categories').select('*').eq('wedding_id', weddingId).order('name')
  if (error) throw error
  return data
}
