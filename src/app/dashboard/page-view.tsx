'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function PageView() {
  const segment = useSelectedLayoutSegment()

  const getPageTitle = () => {
    if (segment === 'insights') return 'AI Insights'
    if (segment?.startsWith('project')) return 'Project Documentation'
    return segment || 'Dashboard'
  }
  return (
    <div className='flex flex-1 items-center gap-4'>
      <h1 className='text-xl font-semibold capitalize'>{getPageTitle()}</h1>
      <div className='relative ml-4 hidden flex-1 md:flex max-w-md'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          type='search'
          placeholder='Search documentation, projects...'
          className='w-full rounded-full border bg-background pl-8 md:w-[300px] lg:w-[400px]'
        />
      </div>
    </div>
  )
}
