import { Copy, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INVITABLE_ROLES, roleBadgeVariant, roleLabel } from '@/features/family/constants'
import type { MemberWithProfile } from '@/services/family'
import type { WeddingMemberRole } from '@/types/database'

interface MemberRowProps {
  member: MemberWithProfile
  currentUserId: string
  canManage: boolean
  inviteMessage: string
  onRoleChange: (member: MemberWithProfile, role: WeddingMemberRole) => void
  onRemove: (member: MemberWithProfile) => void
}

export function MemberRow({ member, currentUserId, canManage, inviteMessage, onRoleChange, onRemove }: MemberRowProps) {
  const isSelf = member.user_id === currentUserId
  const isOwner = member.role === 'owner'
  const displayName = member.status === 'pending' ? member.invited_email : member.fullName || member.invited_email || 'Member'

  async function copyInvite() {
    await navigator.clipboard.writeText(inviteMessage)
    toast.success('Invite message copied — send it however you like.')
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-cream-25 p-4 shadow-soft dark:border-ink-800 dark:bg-ink-800/60">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink-800 dark:text-ink-100">
          {displayName} {isSelf && <span className="text-xs font-normal text-ink-400">(you)</span>}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <Badge variant={roleBadgeVariant(member.role)}>{roleLabel(member.role)}</Badge>
          <Badge variant={member.status === 'pending' ? 'warning' : 'success'}>
            {member.status === 'pending' ? 'Pending' : 'Accepted'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {member.status === 'pending' && (
          <Button variant="ghost" size="icon" className="size-8" onClick={copyInvite} aria-label="Copy invite message">
            <Copy className="size-4" />
          </Button>
        )}

        {canManage && !isOwner && (
          <Select value={member.role} onValueChange={(value) => onRoleChange(member, value as WeddingMemberRole)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INVITABLE_ROLES.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {!isOwner && (canManage || isSelf) && (
          <Button variant="ghost" size="icon" className="size-8 text-danger-500" onClick={() => onRemove(member)} aria-label="Remove">
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
