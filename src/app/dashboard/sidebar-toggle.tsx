'use client'

import { PanelRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

function FloatingSidebarButton() {
  const { setOpen } = useSidebar()

  const handleOpenSidebar = () => {
    setOpen(true)
  }

  return (
    <Button
      size='icon'
      className='w-10 h-10 rounded-full shadow-lg'
      onClick={handleOpenSidebar}
    >
      <PanelRight className='w-5 h-5' />
      <span className='sr-only'>Open Sidebar</span>
    </Button>
  )
}

export function SidebarToggle() {
  const { state } = useSidebar()

  if (state === 'collapsed') {
    return (
      <div className='fixed z-30 left-4 bottom-4'>
        <FloatingSidebarButton />
      </div>
    )
  }

  return null
}
