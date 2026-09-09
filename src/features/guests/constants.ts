import type { InvitationStatus, RsvpStatus } from '@/types/database'

export const FOOD_PREFERENCES = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'No Preference'] as const

export const RSVP_STATUSES: { value: RsvpStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'declined', label: 'Declined' },
]

export const INVITATION_STATUSES: { value: InvitationStatus; label: string }[] = [
  { value: 'not_sent', label: 'Not Sent' },
  { value: 'sent', label: 'Sent' },
  { value: 'delivered', label: 'Delivered' },
]

export function rsvpStatusLabel(status: RsvpStatus) {
  return RSVP_STATUSES.find((s) => s.value === status)?.label ?? status
}

export function invitationStatusLabel(status: InvitationStatus) {
  return INVITATION_STATUSES.find((s) => s.value === status)?.label ?? status
}

export function rsvpBadgeVariant(status: RsvpStatus): 'neutral' | 'success' | 'danger' {
  switch (status) {
    case 'pending':
      return 'neutral'
    case 'confirmed':
      return 'success'
    case 'declined':
      return 'danger'
  }
}

export function invitationBadgeVariant(status: InvitationStatus): 'neutral' | 'gold' | 'rose' {
  switch (status) {
    case 'not_sent':
      return 'neutral'
    case 'sent':
      return 'gold'
    case 'delivered':
      return 'rose'
  }
}
