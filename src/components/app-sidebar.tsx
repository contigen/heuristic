'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart,
  FileText,
  FolderGit2,
  Github,
  Home,
  Settings,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <Sidebar>
      <SidebarHeader className='flex items-center gap-2 px-4'>
        <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary'>
          <span className='text-lg font-bold text-primary-foreground'>h</span>
        </div>
        <Link href='/' className='text-lg font-bold'>
          heuristic
        </Link>
        <SidebarTrigger
          className={`ml-auto ${state === 'collapsed' ? 'bg-primary/10' : ''}`}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
                  <Link href='/dashboard'>
                    <Home className='h-4 w-4' />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/dashboard/projects')}
                >
                  <Link href='/dashboard/projects'>
                    <FolderGit2 className='h-4 w-4' />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/dashboard/insights')}
                >
                  <Link href='/dashboard/insights'>
                    <BarChart className='h-4 w-4' />
                    <span>AI Insights</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Recent Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/dashboard/project/1')}
                >
                  <Link href='/dashboard/project/1'>
                    <FileText className='h-4 w-4' />
                    <span>frontend-app</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/dashboard/project/2')}
                >
                  <Link href='/dashboard/project/2'>
                    <FileText className='h-4 w-4' />
                    <span>api-service</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/dashboard/project/3')}
                >
                  <Link href='/dashboard/project/3'>
                    <FileText className='h-4 w-4' />
                    <span>data-processor</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/dashboard/settings')}
            >
              <Link href='/dashboard/settings'>
                <Settings className='h-4 w-4' />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href='https://github.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Github className='h-4 w-4' />
                <span>GitHub</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
