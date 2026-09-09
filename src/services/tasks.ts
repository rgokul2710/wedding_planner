import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type Task = Database['public']['Tables']['tasks']['Row']
type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export interface TaskInput {
  name: string
  description: string | null
  category: string
  assignedTo: string | null
  dueDate: string | null
  priority: Task['priority']
  status: Task['status']
  estimatedCost: number | null
  actualCost: number | null
  notes: string | null
}

export async function listTasks(weddingId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('due_date', { ascending: true, nullsFirst: false })
  if (error) throw error
  return data
}

export async function createTask(weddingId: string, userId: string, input: TaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      wedding_id: weddingId,
      created_by: userId,
      name: input.name,
      description: input.description,
      category: input.category,
      assigned_to: input.assignedTo,
      due_date: input.dueDate,
      priority: input.priority,
      status: input.status,
      estimated_cost: input.estimatedCost,
      actual_cost: input.actualCost,
      notes: input.notes,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTask(id: string, input: TaskInput): Promise<Task> {
  const patch: TaskUpdate = {
    name: input.name,
    description: input.description,
    category: input.category,
    assigned_to: input.assignedTo,
    due_date: input.dueDate,
    priority: input.priority,
    status: input.status,
    estimated_cost: input.estimatedCost,
    actual_cost: input.actualCost,
    notes: input.notes,
  }
  const { data, error } = await supabase.from('tasks').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function setTaskStatus(id: string, status: Task['status']): Promise<Task> {
  const { data, error } = await supabase.from('tasks').update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}
