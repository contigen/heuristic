import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { FileTreeItem } from '@/components/project/file-tree'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function withTryCatch<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch (err) {
    console.error(err)
    return null
  }
}

export function shouldProcessFile(filename: string): boolean {
  const codeExtensions = [
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.py',
    '.java',
    '.c',
    '.cpp',
    '.cs',
    '.go',
    '.rb',
    '.json',
    '.md',
  ]
  const extension = filename.slice(filename.lastIndexOf('.'))
  return codeExtensions.includes(extension)
}

export function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const units = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'week', seconds: 604800 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
    { name: 'second', seconds: 1 },
  ]

  for (const unit of units) {
    const interval = Math.floor(diffInSeconds / unit.seconds)
    if (interval >= 1) {
      return `${interval} ${unit.name + 's'} ago`
    }
  }

  return 'just now'
}

export function downloadFile(
  content: string,
  filename: string,
  contentType: string
) {
  if (contentType === 'application/pdf') {
    const byteCharacters = atob(content)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: contentType })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
    return
  }

  const blob = new Blob([content], { type: contentType })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export function buildFileTree(
  files: Array<{
    path: string
    complexity?: 'low' | 'medium' | 'high'
    language?: string
  }>
): FileTreeItem[] {
  const root: FileTreeItem[] = []
  const idMap = new Map<string, string>()

  const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path))

  sortedFiles.forEach(file => {
    const parts = file.path.split('/')
    let currentLevel = root
    let currentPath = ''

    parts.forEach((part, index) => {
      const isLastPart = index === parts.length - 1
      currentPath = currentPath ? `${currentPath}/${part}` : part

      const id =
        idMap.get(currentPath) ||
        `file-${Math.random().toString(36).substring(2, 9)}`
      idMap.set(currentPath, id)

      let node = currentLevel.find(item => item.name === part)

      if (!node) {
        node = {
          id,
          name: part,
          path: currentPath,
          type: isLastPart ? 'file' : 'directory',
          children: isLastPart ? undefined : [],
        }

        if (node) {
          node.complexity = file.complexity
          if (isLastPart) {
            node.language = file.language
          }
        }

        if (node) {
          currentLevel.push(node)
        }
        if (!isLastPart && node?.children) {
          currentLevel = node.children
        }
      }
    })

    return root
  })
  return root
}

export function getFileExtension(path: string): string | undefined {
  return path.split('.').pop()?.toLowerCase()
}

export function getLanguageFromExtension(
  extension?: string
): string | undefined {
  if (!extension) return undefined

  const languageMap: Record<string, string> = {
    js: 'JavaScript',
    jsx: 'JavaScript',
    ts: 'TypeScript',
    tsx: 'TypeScript',
    py: 'Python',
    rb: 'Ruby',
    java: 'Java',
    go: 'Go',
    php: 'PHP',
    cs: 'C#',
    cpp: 'C++',
    c: 'C',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    md: 'Markdown',
    json: 'JSON',
    yml: 'YAML',
    yaml: 'YAML',
  }

  return languageMap[extension]
}
