'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { FileReference } from '@/components/project/file-reference'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FileStatisticsProps {
  statistics: {
    totalFiles: number
    totalLinesOfCode: number
    components: number
    customHooks: number
  }
  componentFiles: string[]
  hookFiles: string[]
  className?: string
}

export function FileStatistics({
  statistics,
  componentFiles,
  hookFiles,
  className = '',
}: FileStatisticsProps) {
  return (
    <Card className={`border-0 shadow-md ${className}`}>
      <CardHeader className='elegant-card-header'>
        <CardTitle>Project Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {[
              { label: 'Total Files', value: statistics.totalFiles.toString() },
              {
                label: 'Lines of Code',
                value: statistics.totalLinesOfCode.toLocaleString(),
              },
              { label: 'Components', value: statistics.components.toString() },
              {
                label: 'Custom Hooks',
                value: statistics.customHooks.toString(),
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className='rounded-xl border p-4 bg-gradient-to-br from-muted/50 to-transparent'>
                  <div className='text-sm font-medium text-muted-foreground'>
                    {stat.label}
                  </div>
                  <div className='mt-1 text-2xl font-bold'>{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>
                Components ({componentFiles.length})
              </h3>
              <Card className='border'>
                <ScrollArea className='h-[200px]'>
                  <div className='p-3 space-y-1.5'>
                    {componentFiles.map(file => (
                      <div
                        key={file}
                        className='flex items-center justify-between'
                      >
                        <FileReference filePath={file} />
                        <Badge variant='outline' className='text-xs'>
                          component
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>

            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>
                Custom Hooks ({hookFiles.length})
              </h3>
              <Card className='border'>
                <ScrollArea className='h-[200px]'>
                  <div className='p-3 space-y-1.5'>
                    {hookFiles.map(file => (
                      <div
                        key={file}
                        className='flex items-center justify-between'
                      >
                        <FileReference filePath={file} />
                        <Badge variant='outline' className='text-xs'>
                          hook
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
