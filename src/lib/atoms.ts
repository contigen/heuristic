import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { ProjectDocumentation } from '@/lib/schema'

export const documentationAtom = atomWithStorage<{
  [projectId: string]: ProjectDocumentation | null
}>('heuristic_documentation', {})

export const documentationLoadingAtom = atomWithStorage<{
  [projectId: string]: boolean
}>('heuristic_documentation_loading', {})

export const documentationErrorAtom = atomWithStorage<{
  [projectId: string]: string | null
}>('heuristic_documentation_error', {})

export const architectureDiagramsAtom = atomWithStorage<{
  [projectId: string]: {
    componentDiagram?: string
    metadata?: any
    description?: string
  }
}>('heuristic_architecture_diagrams', {})

export const getProjectDocumentationAtom = (projectId: string) => {
  return atom(get => {
    const documentation = get(documentationAtom)
    const isLoading = get(documentationLoadingAtom)
    const error = get(documentationErrorAtom)

    return {
      documentation: documentation[projectId] || null,
      isLoading: !!isLoading[projectId],
      error: error[projectId] || null,
    }
  })
}
