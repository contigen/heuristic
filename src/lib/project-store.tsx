import { atom } from 'jotai'

export const architectureDiagramsAtom = atom<{
  [projectId: string]: {
    componentDiagram?: string
    dataDiagram?: string
    dependencyDiagram?: string
    metadata?: {
      nodeCount?: number
      edgeCount?: number
      diagramType?: string
      direction?: string
    }
    description?: string
  }
}>({})

export const getProjectDocumentationAtom = (projectId: string) => {
  return atom(get => ({
    documentation: null,
    isLoading: false,
    error: null,
    architectureDiagrams: get(architectureDiagramsAtom)[projectId] || null,
  }))
}
