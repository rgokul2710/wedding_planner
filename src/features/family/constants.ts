import type { WeddingMemberRole } from '@/types/database'

export const INVITABLE_ROLES: { value: WeddingMemberRole; label: string; description: string }[] = [
  { value: 'partner', label: 'Partner', description: 'Almost full access' },
  { value: 'family', label: 'Family', description: 'Can manage planning details' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only' },
]

export function roleLabel(role: WeddingMemberRole) {
  switch (role) {
    case 'owner':
      return 'Owner'
    case 'partner':
      return 'Partner'
    case 'family':
      return 'Family'
    case 'viewer':
      return 'Viewer'
  }
}

export function roleBadgeVariant(role: WeddingMemberRole): 'gold' | 'rose' | 'neutral' {
  switch (role) {
    case 'owner':
      return 'gold'
    case 'partner':
      return 'rose'
    default:
      return 'neutral'
  }
}

export function buildInviteMessage(brideName: string, groomName: string, email: string) {
  const appUrl = `${window.location.origin}${import.meta.env.BASE_URL}`
  return `You're invited to help plan ${brideName} & ${groomName}'s wedding! Sign up at ${appUrl} using this email address: ${email}`
}
