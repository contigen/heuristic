'use client'

import { ChevronRight, ChevronDown, File } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useFileNavigation } from '@/components/project/file-navigation-context'

export interface FileTreeItem {
  name: string
  path: string
  children?: FileTreeItem[]
  isDirectory: boolean
  complexity?: 'low' | 'medium' | 'high'
}

interface FileTreeProps {
  items: FileTreeItem[]
  level?: number
  onSelectFile?: (file: FileTreeItem) => void
}

export function FileTree({ items, level = 0, onSelectFile }: FileTreeProps) {
  const { navigateToFile, currentFile } = useFileNavigation()

  const handleSelectFile = (file: FileTreeItem) => {
    if (!file.isDirectory) {
      navigateToFile(file.path)
      if (onSelectFile) {
        onSelectFile(file)
      }
    }
  }

  return (
    <ul className={cn('space-y-1', level > 0 && 'pl-4')}>
      {items.map(item => (
        <FileTreeNode
          key={item.path}
          item={item}
          level={level}
          onSelectFile={handleSelectFile}
          isSelected={currentFile?.path === item.path}
        />
      ))}
    </ul>
  )
}

interface FileTreeNodeProps {
  item: FileTreeItem
  level: number
  onSelectFile: (file: FileTreeItem) => void
  isSelected: boolean
}

function FileTreeNode({
  item,
  level,
  onSelectFile,
  isSelected,
}: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 1)

  const toggleExpand = () => {
    if (item.isDirectory) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleClick = () => {
    if (item.isDirectory) {
      toggleExpand()
    } else {
      onSelectFile(item)
    }
  }

  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case 'low':
        return 'bg-green-500/20 text-green-600'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-600'
      case 'high':
        return 'bg-red-500/20 text-red-600'
      default:
        return 'bg-gray-500/20 text-gray-600'
    }
  }

  return (
    <li>
      <div
        className={cn(
          'flex items-center py-1 px-2 rounded-md hover:bg-muted/50 cursor-pointer',
          isSelected && 'bg-primary/10 text-primary font-medium'
        )}
        onClick={handleClick}
      >
        <span className='mr-1'>
          {item.isDirectory ? (
            isExpanded ? (
              <ChevronDown className='h-4 w-4 text-muted-foreground' />
            ) : (
              <ChevronRight className='h-4 w-4 text-muted-foreground' />
            )
          ) : (
            <File className='h-4 w-4 text-muted-foreground' />
          )}
        </span>
        <span className='truncate'>{item.name}</span>
        {!item.isDirectory && item.complexity && (
          <span
            className={cn(
              'ml-auto text-xs px-1.5 py-0.5 rounded-full',
              getComplexityColor(item.complexity)
            )}
          >
            {item.complexity}
          </span>
        )}
      </div>
      {item.isDirectory && isExpanded && item.children && (
        <FileTree
          items={item.children}
          level={level + 1}
          onSelectFile={onSelectFile}
        />
      )}
    </li>
  )
}
