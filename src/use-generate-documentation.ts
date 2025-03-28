'use client'

import { useState } from 'react'
import { useAtom } from 'jotai'
import {
  documentationAtom,
  documentationLoadingAtom,
  documentationErrorAtom,
} from '@/lib/atoms'
import { generateDocumentation } from '@/generate-documentation'
import type { ProjectDocumentation } from '@/lib/schema'
import { toast } from 'sonner'

export function useGenerateDocumentation() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [documentations, setDocumentations] = useAtom(documentationAtom)
  const [loadingStates, setLoadingStates] = useAtom(documentationLoadingAtom)
  const [errors, setErrors] = useAtom(documentationErrorAtom)

  const generateProjectDocumentation = async (
    projectId: string,
    projectName: string,
    files: Array<{ path: string; content: string; language?: string | null }>,
    options?: {
      repositoryUrl?: string
      language?: string | null
      description?: string
      dependencies?: Record<string, string>
      contributors?: string[]
    }
  ) => {
    try {
      // Update loading state
      setIsGenerating(true)
      setLoadingStates(prev => ({ ...prev, [projectId]: true }))
      setErrors(prev => ({ ...prev, [projectId]: null }))

      // Call the server action
      const result = await generateDocumentation({
        projectId,
        projectName,
        repositoryUrl: options?.repositoryUrl,
        language: options?.language,
        files,
        context: {
          description: options?.description,
          dependencies: options?.dependencies,
          contributors: options?.contributors,
        },
      })

      // Handle the result
      if (result.success && result.data) {
        // Update the documentation atom
        setDocumentations(prev => ({
          ...prev,
          [projectId]: result.data as ProjectDocumentation,
        }))

        toast.info('Documentation generated', {
          description: `Documentation for ${projectName} has been successfully generated.`,
        })

        return result.data
      } else {
        // Handle error
        setErrors(prev => ({
          ...prev,
          [projectId]: result.error || 'Failed to generate documentation',
        }))

        toast.error('Documentation generation failed', {
          description:
            result.error || 'An error occurred while generating documentation.',
        })

        return null
      }
    } catch (error) {
      // Handle unexpected errors
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred'

      setErrors(prev => ({ ...prev, [projectId]: errorMessage }))

      toast.error('Documentation generation failed', {
        description: errorMessage,
      })

      return null
    } finally {
      // Reset loading state
      setIsGenerating(false)
      setLoadingStates(prev => ({ ...prev, [projectId]: false }))
    }
  }

  return {
    generateProjectDocumentation,
    isGenerating,
    documentations,
    loadingStates,
    errors,
  }
}
