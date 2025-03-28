import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='skeleton'
      className={cn(
        'bg-stone-100 dark:bg-zinc-800  animate-pulse rounded-xl',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
