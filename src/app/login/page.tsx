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
import { Github } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const error = params.get(`error`)
    if (error) {
      setTimeout(() => toast.error(`Authentication error: ${error}`))
      router.replace('login')
    }
  }, [params, router])

  return (
    <div className='flex min-h-screen items-center justify-center p-4 animated-bg'>
      <div className='decorative-dots h-full w-full absolute top-0 left-0 -z-10'></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <Card className='border-0 shadow-xl bg-card/95 backdrop-blur-sm'>
          <CardHeader className='text-center space-y-6'>
            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
              <div className='flex size-12 items-center justify-center rounded-full bg-primary'>
                <span className='text-2xl font-bold text-primary-foreground'>
                  h
                </span>
              </div>
            </div>
            <div>
              <CardTitle className='text-2xl'>Welcome to heuristic</CardTitle>
              <CardDescription className='mt-2'>
                Connect with GitHub to get started with AI-powered documentation
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => signIn('github')}
              className='w-full gap-2 rounded-full h-12'
              size='lg'
            >
              <Github className='h-5 w-5' />
              Continue with GitHub
            </Button>
          </CardContent>
          <CardFooter className='flex flex-col gap-4 text-center text-sm text-muted-foreground'>
            <p>
              Don&rsquo;t have a GitHub account?{' '}
              <Link
                href='https://github.com/join'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary underline underline-offset-4 hover:text-primary/80'
              >
                Sign up for GitHub
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
