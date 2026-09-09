import { supabase } from '@/lib/supabase'
import type { Database, WeddingMemberRole } from '@/types/database'

export type WeddingMember = Database['public']['Tables']['wedding_members']['Row']
export interface MemberWithProfile extends WeddingMember {
  fullName: string | null
}

export async function listMembers(weddingId: string): Promise<MemberWithProfile[]> {
  const { data: members, error } = await supabase
    .from('wedding_members')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('created_at')
  if (error) throw error

  const userIds = members.map((m) => m.user_id).filter((id): id is string => id != null)
  let namesByUserId = new Map<string, string | null>()

  if (userIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('id, full_name').in('id', userIds)
    if (profilesError) throw profilesError
    namesByUserId = new Map(profiles.map((p) => [p.id, p.full_name]))
  }

  return members.map((member) => ({
    ...member,
    fullName: member.user_id ? namesByUserId.get(member.user_id) ?? null : null,
  }))
}

export async function inviteMember(weddingId: string, email: string, role: WeddingMemberRole): Promise<void> {
  const { error } = await supabase.from('wedding_members').insert({
    wedding_id: weddingId,
    invited_email: email.trim().toLowerCase(),
    role,
    status: 'pending',
  })
  if (error) {
    if (error.code === '23505') throw new Error('This email has already been invited.')
    throw error
  }
}

export async function updateMemberRole(id: string, role: WeddingMemberRole): Promise<void> {
  const { error } = await supabase.from('wedding_members').update({ role }).eq('id', id)
  if (error) throw error
}

export async function removeMember(id: string): Promise<void> {
  const { error } = await supabase.from('wedding_members').delete().eq('id', id)
  if (error) throw error
}
