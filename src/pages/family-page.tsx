import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, UserPlus } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { buildInviteMessage } from '@/features/family/constants'
import { InviteForm } from '@/features/family/invite-form'
import { MemberRow } from '@/features/family/member-row'
import { useAuth } from '@/hooks/use-auth'
import { membersQueryKey, useMembers } from '@/hooks/use-family'
import { useWedding } from '@/hooks/use-wedding'
import { inviteMember, removeMember, updateMemberRole } from '@/services/family'
import type { MemberWithProfile } from '@/services/family'
import type { WeddingMemberRole } from '@/types/database'

export function FamilyPage() {
  const { data: wedding } = useWedding()
  const { user } = useAuth()
  const weddingId = wedding!.id
  const { data: members, isPending } = useMembers(weddingId)
  const queryClient = useQueryClient()

  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [removingMember, setRemovingMember] = React.useState<MemberWithProfile | null>(null)

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: membersQueryKey(weddingId) })
  }

  const inviteMutation = useMutation({
    mutationFn: ({ email, role }: { email: string; role: WeddingMemberRole }) => inviteMember(weddingId, email, role),
    onSuccess: () => {
      invalidate()
      setInviteOpen(false)
    },
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: WeddingMemberRole }) => updateMemberRole(id, role),
    onSuccess: invalidate,
  })

  const removeMutation = useMutation({
    mutationFn: (member: MemberWithProfile) => removeMember(member.id),
    onSuccess: () => {
      invalidate()
      setRemovingMember(null)
    },
  })

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-rose-400" />
      </div>
    )
  }

  const allMembers = members ?? []
  const currentMember = allMembers.find((m) => m.user_id === user!.id)
  const canManage = currentMember?.role === 'owner' || currentMember?.role === 'partner'

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Family &amp; Members</h1>
        {canManage && (
          <Button onClick={() => setInviteOpen(true)}>
            <Plus className="size-4" />
            Invite
          </Button>
        )}
      </div>

      <p className="text-sm text-ink-400">
        Owners and partners have full planning access. Family can manage planning details. Viewers can see everything but can't make changes.
      </p>

      <div className="space-y-3">
        {allMembers.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            currentUserId={user!.id}
            canManage={canManage}
            inviteMessage={buildInviteMessage(wedding!.bride_name, wedding!.groom_name, member.invited_email ?? '')}
            onRoleChange={(m, role) => roleMutation.mutate({ id: m.id, role })}
            onRemove={setRemovingMember}
          />
        ))}
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="size-5" />
              Invite Someone
            </DialogTitle>
          </DialogHeader>
          <InviteForm onCancel={() => setInviteOpen(false)} onSubmit={(email, role) => inviteMutation.mutateAsync({ email, role })} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(removingMember)}
        onOpenChange={(open) => !open && setRemovingMember(null)}
        title={removingMember?.user_id === user!.id ? 'Leave this wedding?' : 'Remove this member?'}
        description="They will lose access immediately. This can't be undone, though they can be re-invited later."
        confirmLabel="Remove"
        isLoading={removeMutation.isPending}
        onConfirm={() => removingMember && removeMutation.mutate(removingMember)}
      />
    </div>
  )
}
