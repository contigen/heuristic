'use client'

import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='border-b'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-2'>
            <div className='relative h-8 w-8 overflow-hidden rounded-md bg-primary'>
              <div className='absolute inset-0 flex items-center justify-center text-primary-foreground'>
                h
              </div>
            </div>
            <span className='text-xl font-bold'>heuristic</span>
          </div>
          <div className='flex items-center gap-4'>
            <ModeToggle />
            <Link href='/login'>
              <Button variant='outline' className='rounded-full'>
                Log in
              </Button>
            </Link>
            <Link href='/dashboard'>
              <Button className='rounded-full'>Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className='flex-1'>
        <div className='decorative-dots h-full w-full absolute top-0 left-0 -z-10'></div>
        <section className='container mx-auto px-4 py-24 text-center relative overflow-hidden'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mx-auto max-w-3xl relative z-10'
          >
            <h1 className='mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl'>
              AI-Powered <span className='gradient-text'>Documentation</span>{' '}
              for Your Code
            </h1>
            <p className='mb-8 text-xl text-muted-foreground'>
              heuristic analyzes your repositories, generates comprehensive
              documentation, and provides intelligent insights to improve your
              codebase.
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <Link href='/login'>
                <Button
                  size='lg'
                  className='gap-2 rounded-full px-8 shadow-lg hover:shadow-primary/20'
                >
                  <Github className='h-5 w-5' />
                  Connect with GitHub
                </Button>
              </Link>
              <Link href='/dashboard'>
                <Button
                  size='lg'
                  variant='secondary'
                  className='rounded-full px-8'
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className='absolute -z-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></div>
        </section>

        <section
          id='features'
          className='container mx-auto px-4 py-24 relative'
        >
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
              Key Features
            </h2>
            <p className='mx-auto max-w-2xl text-muted-foreground'>
              heuristic combines AI-powered analysis with elegant documentation
              to help you understand and improve your code.
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {[
              {
                title: 'AI-Generated Documentation',
                description:
                  'Automatically generate comprehensive documentation for your code repositories.',
              },
              {
                title: 'Code Complexity Analysis',
                description:
                  'Identify complex areas of your codebase with our visual heatmap.',
              },
              {
                title: 'Refactoring Suggestions',
                description:
                  'Get AI-powered recommendations to improve your code quality.',
              },
              {
                title: 'Pull Request Analysis',
                description:
                  'Automatically summarize PR changes and generate documentation.',
              },
              {
                title: 'Team Collaboration',
                description:
                  'Work together with your team to improve your codebase.',
              },
              {
                title: 'GitHub Integration',
                description:
                  'Seamlessly connect with your GitHub repositories.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='gradient-border subtle-hover'
              >
                <div className='rounded-xl bg-card p-6 h-full'>
                  <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                    <div className='h-6 w-6 rounded-full bg-primary'></div>
                  </div>
                  <h3 className='mb-2 text-xl font-medium'>{feature.title}</h3>
                  <p className='text-muted-foreground'>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <footer className='border-t py-8 bg-muted/30'>
        <div className='container mx-auto px-4 text-center text-sm text-muted-foreground'>
          <p>© {new Date().getFullYear()} heuristic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
