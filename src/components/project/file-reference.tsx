'use client'

import type React from 'react'

import { FileCode, FileText, File } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useFileNavigation } from '@/components/project/file-navigation-context'
import { getFileExtension } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { memo } from 'react'

interface FileReferenceProps {
  filePath: string
  showIcon?: boolean
  showBadge?: boolean
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

export const FileReference = memo(
  function FileReference({
    filePath,
    showIcon = true,
    showBadge = false,
    children,
    onClick,
  }: FileReferenceProps) {
    const context = useFileNavigation()
    const selectFile = context?.selectFile

    const getFileIcon = () => {
      if (!filePath) return <File className='h-4 w-4 text-primary' />

      const extension = getFileExtension(filePath)

      if (['js', 'jsx', 'ts', 'tsx'].includes(extension || '')) {
        return <FileCode className='h-4 w-4 text-primary' />
      } else if (['md', 'txt', 'json'].includes(extension || '')) {
        return <FileText className='h-4 w-4 text-primary' />
      }

      return <File className='h-4 w-4 text-primary' />
    }

    const handleClick = () => {
      onClick?.()
      if (!filePath || !selectFile) return

      const fileName = filePath.split('/').pop() || ''
      selectFile({
        id: `file-ref-${filePath.replace(/[^a-zA-Z0-9]/g, '-')}`,
        name: fileName,
        path: filePath,
        type: 'file',
      })
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleClick}
              className='inline-flex items-center gap-1.5 text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1 -mx-1'
              type='button'
              disabled={!selectFile}
            >
              {showIcon && getFileIcon()}
              {children ||
                (filePath ? filePath.split('/').pop() : 'Unknown file')}
              {showBadge && (
                <Badge variant='outline' className='text-xs py-0 h-4'>
                  file
                </Badge>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side='top' className='text-xs'>
            {filePath || 'Unknown file path'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.filePath === nextProps.filePath &&
      prevProps.showIcon === nextProps.showIcon &&
      prevProps.showBadge === nextProps.showBadge &&
      prevProps.className === nextProps.className
    )
  }
)
