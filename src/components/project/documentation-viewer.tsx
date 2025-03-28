'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAtomValue } from 'jotai'
import { getProjectDocumentationAtom } from '@/lib/atoms'
import { FileReference } from '@/components/project/file-reference'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useFileNavigation } from '@/components/project/file-navigation-context'

interface DocumentationViewerProps {
  projectId: string
  enhanceFileReferences?: boolean
}

export function DocumentationViewer({
  projectId,
  enhanceFileReferences = false,
}: DocumentationViewerProps) {
  const { documentation, isLoading } = useAtomValue(
    getProjectDocumentationAtom(projectId)
  )
  const { navigateToFile } = useFileNavigation()

  const keyFeaturesSection = useMemo(() => {
    if (!documentation || !documentation.sections) return undefined
    return documentation.sections?.find(
      section =>
        section.title.toLowerCase().includes('feature') ||
        section.title.toLowerCase().includes('key')
    )
  }, [documentation])

  // Extract key features from the content if available
  const keyFeatures = useMemo(() => {
    if (!keyFeaturesSection) return []

    // Simple heuristic: Split by bullet points or numbered lists
    const content = keyFeaturesSection.content
    const features = content
      .split(/\n\s*[-•*]\s+|\n\s*\d+\.\s+/)
      .filter(item => item.trim().length > 0)
      .map(item => item.trim())

    return features.length > 1 ? features : [content]
  }, [keyFeaturesSection])

  // Function to enhance text with file references
  const enhanceText = useMemo(() => {
    const enhance = (text: string) => {
      if (!text) return text || ''

      // This is a simple regex to find file paths
      // In a real app, this would be more sophisticated
      const filePathRegex = /(src\/[a-zA-Z0-9/._-]+\.[a-zA-Z0-9]+)/g

      // Split the text by file paths
      const parts = text.split(filePathRegex)

      if (parts.length <= 1) return text

      // Create a stable array of elements to prevent re-renders
      return parts.map((part, index) => {
        // Every odd index is a file path
        if (index % 2 === 1) {
          // Use a key that's based on the file path to ensure stability
          const key = `file-ref-${part.replace(/[^a-zA-Z0-9]/g, '-')}-${index}`
          try {
            return (
              <FileReference
                key={key}
                filePath={part}
                onClick={() => navigateToFile(part)}
              >
                {part}
              </FileReference>
            )
          } catch (error) {
            // If FileReference fails, just return the text
            console.warn('Error rendering FileReference:', error)
            return part
          }
        }
        return part
      })
    }

    return enhance
  }, [navigateToFile])

  if (isLoading) {
    return <DocumentationSkeleton />
  }

  if (!documentation) {
    return (
      <Card className='h-full border-0 shadow-md elegant-card'>
        <CardHeader className='elegant-card-header'>
          <CardTitle>Documentation</CardTitle>
        </CardHeader>
        <CardContent className='flex items-center justify-center h-[300px] text-muted-foreground'>
          <div className='text-center'>
            <p>No documentation available</p>
            <p className='text-sm mt-2'>
              Generate documentation to see AI-powered insights about this
              project.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='h-full border-0 shadow-md elegant-card'>
      <CardHeader className='elegant-card-header'>
        <CardTitle>Documentation</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='space-y-8 overflow-auto h-[calc(100vh-300px)] min-h-[400px] pr-4'>
          {/* Overview Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className='space-y-4'>
              <h2 className='text-2xl font-bold tracking-tight text-primary'>
                Overview
              </h2>
              <div>
                <h3 className='text-lg font-medium'>Project Overview</h3>
                <p className='mt-2 text-muted-foreground'>
                  {enhanceFileReferences
                    ? enhanceText(documentation.overview)
                    : documentation.overview}
                </p>
              </div>

              {/* Architecture section */}
              {documentation.sections?.find(section =>
                section.title.toLowerCase().includes('architecture')
              ) && (
                <div>
                  <h3 className='text-lg font-medium'>Architecture</h3>
                  <p className='mt-2 text-muted-foreground'>
                    {enhanceFileReferences
                      ? enhanceText(
                          documentation.sections.find(section =>
                            section.title.toLowerCase().includes('architecture')
                          )?.content || ''
                        )
                      : documentation.sections.find(section =>
                          section.title.toLowerCase().includes('architecture')
                        )?.content}
                  </p>
                </div>
              )}

              {/* Key Features section */}
              {keyFeatures.length > 0 && (
                <div>
                  <h3 className='text-lg font-medium'>Key Features</h3>
                  <ul className='mt-2 list-disc pl-5 space-y-1 text-muted-foreground'>
                    {keyFeatures.map((feature, index) => (
                      <li key={index}>
                        {enhanceFileReferences ? enhanceText(feature) : feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>

          {/* Components Section */}
          {documentation.sections?.some(
            section =>
              section.title.toLowerCase().includes('component') ||
              section.title.toLowerCase().includes('ui') ||
              section.title.toLowerCase().includes('interface')
          ) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className='space-y-4'>
                <h2 className='text-2xl font-bold tracking-tight'>
                  Components
                </h2>
                <div className='space-y-6'>
                  {/* Find component sections */}
                  {documentation.sections
                    ?.filter(
                      section =>
                        section.title.toLowerCase().includes('component') ||
                        section.title.toLowerCase().includes('ui') ||
                        section.title.toLowerCase().includes('interface')
                    )
                    .map((section, index) => (
                      <div key={index} className='space-y-2'>
                        <h3 className='text-lg font-medium'>{section.title}</h3>
                        <p className='text-muted-foreground'>
                          {enhanceFileReferences
                            ? enhanceText(section.content)
                            : section.content}
                        </p>

                        {section.codeExamples &&
                          section.codeExamples.length > 0 && (
                            <div className='mt-3'>
                              <h4 className='text-sm font-medium'>
                                Code Examples
                              </h4>
                              {section.codeExamples.map(
                                (example, exampleIndex) => (
                                  <pre
                                    key={exampleIndex}
                                    className='mt-1 text-xs bg-muted/30 p-2 rounded-md'
                                  >
                                    {example.code}
                                  </pre>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Utilities Section */}
          {documentation.sections?.some(
            section =>
              section.title.toLowerCase().includes('util') ||
              section.title.toLowerCase().includes('helper') ||
              section.title.toLowerCase().includes('function')
          ) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className='space-y-4'>
                <h2 className='text-2xl font-bold tracking-tight'>Utilities</h2>
                <div className='space-y-6'>
                  {/* Find utility sections */}
                  {documentation.sections
                    ?.filter(
                      section =>
                        section.title.toLowerCase().includes('util') ||
                        section.title.toLowerCase().includes('helper') ||
                        section.title.toLowerCase().includes('function')
                    )
                    .map((section, index) => (
                      <div key={index} className='space-y-2'>
                        <h3 className='text-lg font-medium'>{section.title}</h3>
                        <p className='text-muted-foreground'>
                          {enhanceFileReferences
                            ? enhanceText(section.content)
                            : section.content}
                        </p>

                        {section.codeExamples &&
                          section.codeExamples.length > 0 && (
                            <div className='mt-3'>
                              <h4 className='text-sm font-medium'>
                                Code Examples
                              </h4>
                              {section.codeExamples.map(
                                (example, exampleIndex) => (
                                  <pre
                                    key={exampleIndex}
                                    className='mt-1 text-xs bg-muted/30 p-2 rounded-md'
                                  >
                                    {example.code}
                                  </pre>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* API Section */}
          {documentation.sections?.some(
            section =>
              section.title.toLowerCase().includes('api') ||
              section.title.toLowerCase().includes('endpoint') ||
              section.title.toLowerCase().includes('route')
          ) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className='space-y-4'>
                <h2 className='text-2xl font-bold tracking-tight'>API</h2>
                <div className='space-y-6'>
                  {/* Find API sections */}
                  {documentation.sections
                    ?.filter(
                      section =>
                        section.title.toLowerCase().includes('api') ||
                        section.title.toLowerCase().includes('endpoint') ||
                        section.title.toLowerCase().includes('route')
                    )
                    .map((section, index) => (
                      <div key={index} className='space-y-2'>
                        <h3 className='text-lg font-medium'>{section.title}</h3>
                        <p className='text-muted-foreground'>
                          {enhanceFileReferences
                            ? enhanceText(section.content)
                            : section.content}
                        </p>

                        {section.codeExamples &&
                          section.codeExamples.length > 0 && (
                            <div className='mt-3'>
                              <h4 className='text-sm font-medium'>
                                Code Examples
                              </h4>
                              {section.codeExamples.map(
                                (example, exampleIndex) => (
                                  <pre
                                    key={exampleIndex}
                                    className='mt-1 text-xs bg-muted/30 p-2 rounded-md'
                                  >
                                    {example.code}
                                  </pre>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function DocumentationSkeleton() {
  return (
    <Card className='h-full border-0 shadow-md elegant-card'>
      <CardHeader className='elegant-card-header'>
        <Skeleton className='h-6 w-32' />
      </CardHeader>
      <CardContent className='p-6'>
        <div className='space-y-8'>
          <div>
            <Skeleton className='h-8 w-32 mb-4' />
            <Skeleton className='h-6 w-48 mb-4' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-3/4 mb-6' />
          </div>

          <div>
            <Skeleton className='h-8 w-48 mb-4' />
            <Skeleton className='h-6 w-48 mb-4' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-5/6 mb-6' />
          </div>

          <div>
            <Skeleton className='h-8 w-32 mb-4' />
            <Skeleton className='h-6 w-48 mb-4' />
            <Skeleton className='h-4 w-1/2 mb-2' />
            <Skeleton className='h-4 w-2/3 mb-2' />
            <Skeleton className='h-4 w-3/4 mb-2' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
