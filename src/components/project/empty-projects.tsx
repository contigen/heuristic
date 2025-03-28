'use client'

import { Button } from '@/components/ui/button'
import { Github, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export function EmptyProjects({ onConnect }: { onConnect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex flex-col items-center justify-center py-16 px-4 text-center'
    >
      <div className='mb-6 rounded-full bg-primary/10 p-6'>
        <Github className='h-12 w-12 text-primary' />
      </div>
      <h3 className='mb-2 text-2xl font-bold'>No repositories connected yet</h3>
      <p className='mb-8 max-w-md text-muted-foreground'>
        Connect your GitHub repositories to get started with AI-powered
        documentation and insights.
      </p>
      <Button onClick={onConnect} className='gap-2 rounded-full'>
        <Plus className='h-4 w-4' />
        Connect Repository
      </Button>
    </motion.div>
  )
}
