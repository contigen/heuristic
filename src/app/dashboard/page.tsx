'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RecentProjects } from '@/components/dashboard/recent-projects'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { AIInsights } from '@/components/dashboard/ai-insights'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='flex items-center justify-between'
      >
        <h2 className='text-3xl font-bold tracking-tight'>Welcome back</h2>

        <Button className='gap-2 rounded-full' asChild>
          <Link href='/dashboard/projects'>
            <Plus className='w-4 h-4' />
            Add Project
          </Link>
        </Button>
      </motion.div>

      <Tabs defaultValue='overview' className='space-y-6'>
        <TabsList className='p-1 rounded-full'>
          <TabsTrigger value='overview' className='rounded-full'>
            Overview
          </TabsTrigger>
          <TabsTrigger value='activity' className='rounded-full'>
            Activity
          </TabsTrigger>
          <TabsTrigger value='insights' className='rounded-full'>
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'
          >
            {[
              {
                title: 'Total Projects',
                value: '12',
                change: '+2 from last month',
              },
              {
                title: 'Documentation Coverage',
                value: '87%',
                change: '+5% from last month',
              },
              {
                title: 'Code Quality Score',
                value: 'A-',
                change: 'Improved from B+',
              },
              {
                title: 'AI Suggestions',
                value: '24',
                change: '8 high priority',
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className='overflow-hidden border-0 shadow-md bg-gradient-to-br from-card to-card/80'>
                  <div className='absolute inset-0 opacity-50 bg-gradient-to-r from-primary/5 to-transparent -z-10'></div>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      {stat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{stat.value}</div>
                    <p className='text-xs text-muted-foreground'>
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <RecentProjects />
          </motion.div>
        </TabsContent>

        <TabsContent value='activity' className='space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ActivityFeed />
          </motion.div>
        </TabsContent>

        <TabsContent value='insights' className='space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AIInsights />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
