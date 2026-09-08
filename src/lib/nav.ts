import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  CreditCard,
  FileText,
  Image,
  LayoutDashboard,
  Settings,
  Store,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  primary?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, primary: true },
  { label: 'Tasks', path: '/tasks', icon: CheckSquare, primary: true },
  { label: 'Guests', path: '/guests', icon: Users, primary: true },
  { label: 'Budget', path: '/budget', icon: Wallet, primary: true },
  { label: 'Vendors', path: '/vendors', icon: Store },
  { label: 'Events', path: '/events', icon: CalendarDays },
  { label: 'Payments', path: '/payments', icon: CreditCard },
  { label: 'Documents', path: '/documents', icon: FileText },
  { label: 'Inspiration', path: '/inspiration', icon: Image },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Family', path: '/family', icon: UserPlus },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export const PRIMARY_NAV_ITEMS = NAV_ITEMS.filter((item) => item.primary)
export const MORE_NAV_ITEMS = NAV_ITEMS.filter((item) => !item.primary)
