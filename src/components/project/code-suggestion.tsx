'use client'

import { FileReference } from '@/components/project/file-reference'

interface CodeSuggestionProps {
  title: string
  description: string
  filePath: string
  priority: 'high' | 'medium' | 'low'
  suggestedCode?: {
    code: string
    language?: string
  }
  className?: string
}

export function CodeSuggestion({
  title,
  description,
  filePath,
  priority,
  suggestedCode,
  className = '',
}: CodeSuggestionProps) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm bg-gradient-to-r ${
        priority === 'high'
          ? 'from-red-500/5'
          : priority === 'medium'
          ? 'from-yellow-500/5'
          : 'from-green-500/5'
      } to-transparent ${className}`}
    >
      <h4 className='font-medium flex items-center gap-2'>
        <FileReference filePath={filePath} />
        <span>-</span>
        <span>{title}</span>
      </h4>
      <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
      {suggestedCode && (
        <div className='mt-2'>
          <div className='ai-suggestion text-sm'>
            <pre className='mt-2 text-xs bg-muted/30 p-2 rounded-md'>
              {suggestedCode.code}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
