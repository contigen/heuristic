'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFileNavigation } from '@/components/project/file-navigation-context'
import { useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FileIcon, defaultStyles } from 'react-file-icon'

export function FileContentViewer() {
  const { currentFile, fileHistory } = useFileNavigation()
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!currentFile) return

    const fetchFileContent = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would fetch the actual file content
        // For now, we'll simulate it with a delay and mock content
        await new Promise(resolve => setTimeout(resolve, 300))

        // Generate mock content based on the file path
        const mockContent = generateMockContent(currentFile.path)
        setFileContent(mockContent)
      } catch (error) {
        console.error('Error fetching file content:', error)
        setFileContent('// Error loading file content')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFileContent()
  }, [currentFile])

  const getLanguage = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'js':
        return 'javascript'
      case 'jsx':
        return 'jsx'
      case 'ts':
        return 'typescript'
      case 'tsx':
        return 'tsx'
      case 'html':
        return 'html'
      case 'css':
        return 'css'
      case 'json':
        return 'json'
      case 'md':
        return 'markdown'
      default:
        return 'javascript'
    }
  }

  const getFileIconProps = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase()
    return {
      extension,
      ...defaultStyles[extension as keyof typeof defaultStyles],
    }
  }

  if (!currentFile) {
    return (
      <Card className='h-full border-0 shadow-md'>
        <CardHeader className='elegant-card-header'>
          <CardTitle>File Content</CardTitle>
        </CardHeader>
        <CardContent className='flex items-center justify-center h-[300px] text-muted-foreground'>
          <div className='text-center'>
            <p>No file selected</p>
            <p className='text-sm mt-2'>
              Select a file from the project structure or documentation to view
              its content.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='h-full border-0 shadow-md'>
      <CardHeader className='elegant-card-header flex flex-row items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-5 h-5'>
            <FileIcon {...getFileIconProps(currentFile.path)} />
          </div>
          <CardTitle className='truncate'>{currentFile.path}</CardTitle>
        </div>
        <div className='text-xs text-muted-foreground'>
          {currentFile.language || getLanguage(currentFile.path)}
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        {isLoading ? (
          <div className='p-4'>
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-3/4 mb-2' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-5/6 mb-2' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-2/3 mb-2' />
          </div>
        ) : (
          <div className='overflow-auto max-h-[calc(100vh-300px)]'>
            <SyntaxHighlighter
              language={getLanguage(currentFile.path)}
              style={vscDarkPlus}
              customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.9rem' }}
              showLineNumbers
            >
              {fileContent || '// No content available'}
            </SyntaxHighlighter>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Helper function to generate mock content based on file path
function generateMockContent(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase()
  const fileName = filePath.split('/').pop() || ''
  const baseName = fileName.split('.')[0]

  switch (extension) {
    case 'tsx':
    case 'jsx':
      return `import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ${baseName}Props {
  title: string;
  description?: string;
  onAction?: () => void;
}

export function ${baseName}({ title, description, onAction }: ${baseName}Props) {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
      <Button onClick={onAction} className="mt-4">
        Action
      </Button>
    </Card>
  );
}`

    case 'ts':
      return `/**
 * ${baseName} utility functions
 */

export interface ${baseName}Options {
  timeout?: number;
  retries?: number;
  baseUrl?: string;
}

/**
 * Main function for ${baseName}
 */
export function ${baseName.toLowerCase()}(options: ${baseName}Options = {}) {
  const { timeout = 3000, retries = 3, baseUrl = '/api' } = options;
  
  return {
    async getData(endpoint: string) {
      // Implementation details
      return { success: true, data: {} };
    },
    
    async postData(endpoint: string, data: any) {
      // Implementation details
      return { success: true };
    }
  };
}`

    case 'json':
      return `{
  "name": "${baseName}",
  "version": "1.0.0",
  "description": "A sample ${baseName} configuration",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "next": "^13.4.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  }
}`

    case 'md':
      return `# ${baseName}

## Overview

This is the documentation for ${baseName}.

## Usage

\`\`\`js
import { ${baseName} } from './${fileName}';

// Example usage
const result = ${baseName}();
\`\`\`

## API Reference

| Method | Description |
|--------|-------------|
| getData | Fetches data from the API |
| postData | Sends data to the API |

## License

MIT
`

    default:
      return `// ${fileName}
// This is a mock file content for demonstration purposes.

function ${baseName.toLowerCase()}() {
  console.log("${baseName} function called");
  return {
    id: 1,
    name: "${baseName}",
    created: new Date().toISOString()
  };
}

export default ${baseName.toLowerCase()};
`
  }
}
