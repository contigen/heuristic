'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Github,
  RefreshCw,
  Check,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ConnectRepositoryFlow } from '@/components/project/connect-repo-flow'
import { EmptyProjects } from '@/components/project/empty-projects'

export default function ProjectsPage() {
  const [showConnectDialog, setShowConnectDialog] = useState(false)

  const projects = [
    {
      id: '1',
      name: 'frontend-app',
      description: 'React frontend application with TypeScript',
      status: 'up-to-date',
      lastUpdated: '2 hours ago',
      stars: 24,
      language: 'TypeScript',
    },
    {
      id: '2',
      name: 'api-service',
      description: 'REST API service with Express and MongoDB',
      status: 'needs-update',
      lastUpdated: '3 days ago',
      stars: 18,
      language: 'JavaScript',
    },
    {
      id: '3',
      name: 'data-processor',
      description: 'Data processing pipeline with Python',
      status: 'processing',
      lastUpdated: '1 day ago',
      stars: 12,
      language: 'Python',
    },
    {
      id: '4',
      name: 'mobile-app',
      description: 'React Native mobile application',
      status: 'up-to-date',
      lastUpdated: '5 hours ago',
      stars: 31,
      language: 'TypeScript',
    },
    {
      id: '5',
      name: 'auth-service',
      description: 'Authentication service with JWT',
      status: 'needs-update',
      lastUpdated: '5 days ago',
      stars: 9,
      language: 'JavaScript',
    },
    {
      id: '6',
      name: 'analytics-dashboard',
      description: 'Analytics dashboard with D3.js',
      status: 'up-to-date',
      lastUpdated: '1 day ago',
      stars: 15,
      language: 'JavaScript',
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up-to-date':
        return <Check className='h-4 w-4 text-green-500' />
      case 'needs-update':
        return <AlertTriangle className='h-4 w-4 text-yellow-500' />
      case 'processing':
        return <Clock className='h-4 w-4 text-blue-500' />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'up-to-date':
        return 'Up to date'
      case 'needs-update':
        return 'Needs update'
      case 'processing':
        return 'Processing'
      default:
        return status
    }
  }

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'TypeScript':
        return 'bg-blue-500'
      case 'JavaScript':
        return 'bg-yellow-500'
      case 'Python':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className='space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='flex items-center justify-between'
      >
        <h2 className='text-3xl font-bold tracking-tight'>Projects</h2>
        <Button
          className='gap-2 rounded-full'
          onClick={() => setShowConnectDialog(true)}
        >
          <Plus className='h-4 w-4' />
          Connect Repository
        </Button>
      </motion.div>

      {projects.length > 0 ? (
        <Tabs defaultValue='all' className='space-y-6'>
          <div className='flex justify-between'>
            <TabsList className='rounded-full p-1'>
              <TabsTrigger value='all' className='rounded-full'>
                All Projects
              </TabsTrigger>
              <TabsTrigger value='recent' className='rounded-full'>
                Recently Updated
              </TabsTrigger>
              <TabsTrigger value='needs-update' className='rounded-full'>
                Needs Update
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='all' className='space-y-6'>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/dashboard/project/${project.id}`}>
                    <Card className='h-full transition-all hover:shadow-lg hover:-translate-y-1 duration-300 border-0 shadow-md overflow-hidden'>
                      <div
                        className='absolute top-0 left-0 h-1 w-full'
                        style={{
                          background: `linear-gradient(to right, var(--${getLanguageColor(
                            project.language
                          ).replace('bg-', '')}) 0%, transparent 100%)`,
                        }}
                      ></div>
                      <CardHeader className='pb-2'>
                        <div className='flex items-center justify-between'>
                          <CardTitle className='text-xl font-medium'>
                            {project.name}
                          </CardTitle>
                          <Badge
                            variant='outline'
                            className='flex items-center gap-1 font-normal rounded-full'
                          >
                            {getStatusIcon(project.status)}
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                          <span className='flex items-center gap-1'>
                            <div
                              className={`h-3 w-3 rounded-full ${getLanguageColor(
                                project.language
                              )}`}
                            />
                            {project.language}
                          </span>
                          <span>•</span>
                          <span>Updated {project.lastUpdated}</span>
                        </div>
                      </CardContent>
                      <CardFooter className='flex justify-between border-t pt-4'>
                        <div className='flex items-center gap-2 text-sm'>
                          <Github className='h-4 w-4' />
                          <span>{project.stars} stars</span>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='gap-1 rounded-full'
                        >
                          <RefreshCw className='h-3.5 w-3.5' />
                          Sync
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value='recent' className='space-y-6'>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {projects
                .filter(
                  p =>
                    p.lastUpdated.includes('hours') ||
                    p.lastUpdated.includes('day')
                )
                .map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link href={`/dashboard/project/${project.id}`}>
                      <Card className='h-full transition-all hover:shadow-lg hover:-translate-y-1 duration-300 border-0 shadow-md overflow-hidden'>
                        <div
                          className='absolute top-0 left-0 h-1 w-full'
                          style={{
                            background: `linear-gradient(to right, var(--${getLanguageColor(
                              project.language
                            ).replace('bg-', '')}) 0%, transparent 100%)`,
                          }}
                        ></div>
                        <CardHeader className='pb-2'>
                          <div className='flex items-center justify-between'>
                            <CardTitle className='text-xl font-medium'>
                              {project.name}
                            </CardTitle>
                            <Badge
                              variant='outline'
                              className='flex items-center gap-1 font-normal rounded-full'
                            >
                              {getStatusIcon(project.status)}
                              {getStatusText(project.status)}
                            </Badge>
                          </div>
                          <CardDescription>
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <span className='flex items-center gap-1'>
                              <div
                                className={`h-3 w-3 rounded-full ${getLanguageColor(
                                  project.language
                                )}`}
                              />
                              {project.language}
                            </span>
                            <span>•</span>
                            <span>Updated {project.lastUpdated}</span>
                          </div>
                        </CardContent>
                        <CardFooter className='flex justify-between border-t pt-4'>
                          <div className='flex items-center gap-2 text-sm'>
                            <Github className='h-4 w-4' />
                            <span>{project.stars} stars</span>
                          </div>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='gap-1 rounded-full'
                          >
                            <RefreshCw className='h-3.5 w-3.5' />
                            Sync
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value='needs-update' className='space-y-6'>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {projects
                .filter(p => p.status === 'needs-update')
                .map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link href={`/dashboard/project/${project.id}`}>
                      <Card className='h-full transition-all hover:shadow-lg hover:-translate-y-1 duration-300 border-0 shadow-md overflow-hidden'>
                        <div
                          className='absolute top-0 left-0 h-1 w-full'
                          style={{
                            background: `linear-gradient(to right, var(--${getLanguageColor(
                              project.language
                            ).replace('bg-', '')}) 0%, transparent 100%)`,
                          }}
                        ></div>
                        <CardHeader className='pb-2'>
                          <div className='flex items-center justify-between'>
                            <CardTitle className='text-xl font-medium'>
                              {project.name}
                            </CardTitle>
                            <Badge
                              variant='outline'
                              className='flex items-center gap-1 font-normal rounded-full'
                            >
                              {getStatusIcon(project.status)}
                              {getStatusText(project.status)}
                            </Badge>
                          </div>
                          <CardDescription>
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <span className='flex items-center gap-1'>
                              <div
                                className={`h-3 w-3 rounded-full ${getLanguageColor(
                                  project.language
                                )}`}
                              />
                              {project.language}
                            </span>
                            <span>•</span>
                            <span>Updated {project.lastUpdated}</span>
                          </div>
                        </CardContent>
                        <CardFooter className='flex justify-between border-t pt-4'>
                          <div className='flex items-center gap-2 text-sm'>
                            <Github className='h-4 w-4' />
                            <span>{project.stars} stars</span>
                          </div>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='gap-1 rounded-full'
                          >
                            <RefreshCw className='h-3.5 w-3.5' />
                            Sync
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <EmptyProjects onConnect={() => setShowConnectDialog(true)} />
      )}

      <ConnectRepositoryFlow
        open={showConnectDialog}
        onOpenChange={setShowConnectDialog}
      />
    </div>
  )
}
