import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/top-bar'

function ContentFallback() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="size-6 animate-spin text-rose-400" />
    </div>
  )
}

export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 lg:pb-8">
          <Suspense fallback={<ContentFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
