export interface Project {
  id: string
  name: string
  description: string
  repositoryUrl?: string
  language?: string
  lastUpdated: string
  stars?: number
  contributors?: Array<{
    name: string
    avatar: string
  }>
  files?: Array<{
    name: string
    path?: string
    complexity?: 'low' | 'medium' | 'high'
    language?: string
  }>
  componentFiles?: string[]
  hookFiles?: string[]
  suggestions?: Array<{
    title: string
    description: string
    filePath: string
    priority: 'low' | 'medium' | 'high'
    suggestedCode?: {
      code: string
      language?: string
    }
  }>
}
