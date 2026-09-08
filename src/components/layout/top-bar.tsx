import { Moon, Search, Sun } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/hooks/use-theme'

export function TopBar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center gap-3 border-b border-ink-100 bg-cream-25/80 px-4 py-3 backdrop-blur-sm dark:border-ink-800 dark:bg-ink-900/80 sm:px-6">
      <button
        type="button"
        className="flex h-10 flex-1 items-center gap-2 rounded-xl border border-ink-200 bg-cream-50 px-3 text-sm text-ink-400 transition-colors hover:border-ink-300 dark:border-ink-700 dark:bg-ink-800 sm:max-w-xs"
      >
        <Search className="size-4" />
        Search tasks, guests, vendors…
      </button>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-rose-400">
              <Avatar>
                <AvatarFallback>GP</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Wedding Settings</DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
