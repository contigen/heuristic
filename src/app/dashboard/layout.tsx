import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import { UserNav } from '@/components/user-nav'
import { PageView } from './page-view'
import { SidebarToggle } from './sidebar-toggle'
import { SessionProvider } from 'next-auth/react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <div className='flex w-full min-h-screen'>
          <AppSidebar />
          <div className='w-full'>
            <header className='sticky inset-x-0 top-0 z-10 flex items-center h-16 gap-4 px-6 border-b bg-background/95 backdrop-blur-sm'>
              <PageView />
              <div className='flex items-center gap-2'>
                <ModeToggle />
                <UserNav />
              </div>
            </header>
            <main className='p-6'>{children}</main>
          </div>
          <SidebarToggle />
        </div>
      </SidebarProvider>
    </SessionProvider>
  )
}
