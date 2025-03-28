'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Download,
  Github,
  Code,
  FileText,
  BarChart,
  SplitSquareVertical,
  Maximize2,
  GitBranch,
  RefreshCw,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { GenerateDocumentationButton } from '@/components/project/generate-documentation-button'
import { DocumentationViewer } from '@/components/project/documentation-viewer'
import { useAtomValue, useAtom } from 'jotai'
import {
  getProjectDocumentationAtom,
  architectureDiagramsAtom,
} from '@/lib/atoms'
import { Skeleton } from '@/components/ui/skeleton'
import { buildFileTree } from '@/lib/utils'
import { FileTree } from '@/components/project/file-tree'
import { FileContentViewer } from '@/components/project/file-content-viewer'
import { CodeAnalysis } from '@/components/project/code-analysis'
import { generateArchitectureDiagram } from '@/generate-architecture-diagram'
import { FileNavigationProvider } from '@/components/project/file-navigation-context'
import { ArchitectureDiagram } from '@/components/project/architecture-diagram'
import { DocumentationAIInsights } from '@/components/project/documentation-ai-insights'
import { Project } from '@/types'
import { ExportDocumentationDialog } from '@/components/project/export-documentation-dialog'

const fetchProject = async (id: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    id,
    name: 'frontend-app',
    description: 'React frontend application with TypeScript',
    lastUpdated: '2 hours ago',
    stars: 24,
    language: 'TypeScript',
    repositoryUrl: 'https://github.com/username/frontend-app',
    files: [
      { name: 'src/components/Button.tsx', complexity: 'low' },
      { name: 'src/components/Modal.tsx', complexity: 'medium' },
      { name: 'src/components/Card.tsx', complexity: 'low' },
      { name: 'src/components/Form.tsx', complexity: 'medium' },
      { name: 'src/components/Table.tsx', complexity: 'high' },
      { name: 'src/hooks/useAuth.ts', complexity: 'medium' },
      { name: 'src/hooks/useData.ts', complexity: 'medium' },
      { name: 'src/hooks/useLocalStorage.ts', complexity: 'low' },
      { name: 'src/pages/Dashboard.tsx', complexity: 'high' },
      { name: 'src/pages/Login.tsx', complexity: 'medium' },
      { name: 'src/pages/Settings.tsx', complexity: 'medium' },
      { name: 'src/utils/api.ts', complexity: 'low' },
      { name: 'src/utils/format.ts', complexity: 'low' },
      { name: 'src/utils/validation.ts', complexity: 'medium' },
      { name: 'src/App.tsx', complexity: 'medium' },
      { name: 'src/index.tsx', complexity: 'low' },
      { name: 'public/index.html', complexity: 'low' },
      { name: 'public/favicon.ico', complexity: 'low' },
      { name: 'package.json', complexity: 'low' },
      { name: 'tsconfig.json', complexity: 'low' },
      { name: 'README.md', complexity: 'low' },
    ],
    componentFiles: [
      'src/components/Button.tsx',
      'src/components/Modal.tsx',
      'src/components/Card.tsx',
      'src/components/Form.tsx',
      'src/components/Table.tsx',
      'src/pages/Dashboard.tsx',
      'src/pages/Login.tsx',
      'src/pages/Settings.tsx',
      'src/App.tsx',
    ],
    hookFiles: [
      'src/hooks/useAuth.ts',
      'src/hooks/useData.ts',
      'src/hooks/useLocalStorage.ts',
    ],
    suggestions: [
      {
        title: 'High Complexity',
        description:
          'This component has too many responsibilities and should be split into smaller components.',
        filePath: 'src/pages/Dashboard.tsx',
        priority: 'high',
        suggestedCode: {
          code: `// Extract this section
const DataVisualization = ({ data }) => {
  return (
    <div className="charts">
      {/* Chart components */}
    </div>
  );
};`,
          language: 'tsx',
        },
      },
      {
        title: 'Improve Error Handling',
        description:
          'The authentication hook lacks comprehensive error handling.',
        filePath: 'src/hooks/useAuth.ts',
        priority: 'medium',
        suggestedCode: {
          code: `try {
  // Authentication logic
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 403) {
    // Handle forbidden
  } else {
    // Handle other errors
  }
}`,
          language: 'ts',
        },
      },
    ],
  }
}

function ProjectSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <Skeleton className='h-10 w-48 mb-2' />
          <Skeleton className='h-5 w-96' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='h-10 w-40' />
          <Skeleton className='h-10 w-10 rounded-full' />
          <Skeleton className='h-10 w-32' />
        </div>
      </div>

      <Skeleton className='h-12 w-full rounded-full' />

      <div className='grid gap-6 md:grid-cols-[300px_1fr]'>
        <div>
          <Skeleton className='h-[500px] w-full rounded-xl' />
        </div>
        <div>
          <Skeleton className='h-[500px] w-full rounded-xl' />
        </div>
      </div>
    </div>
  )
}

export default function ProjectPage() {
  const { id } = useParams()
  const router = useRouter()
  const projectId = Array.isArray(id) ? id[0] : id

  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [viewMode, setViewMode] = useState<'split' | 'full'>('full')

  const projectDocAtom = useMemo(
    () => getProjectDocumentationAtom(String(projectId)),
    [projectId]
  )
  const { documentation } = useAtomValue(projectDocAtom)

  const [architectureDiagrams, setArchitectureDiagrams] = useAtom(
    architectureDiagramsAtom
  )
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false)

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true)
      try {
        if (!projectId) {
          throw new Error('Project ID is required')
        }
        const data = await fetchProject(projectId)
        const projectData: Project = {
          ...data,
          suggestions: data.suggestions.map(suggestion => ({
            ...suggestion,
            priority: suggestion.priority as 'low' | 'medium' | 'high',
          })),
          files: data.files.map(file => ({
            ...file,
            complexity: file.complexity as
              | 'low'
              | 'medium'
              | 'high'
              | undefined,
          })),
        }
        setProject(projectData)
      } catch (error: unknown) {
        console.error('Failed to load project:', error)
        toast.error('Failed to load project details')
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  const handleGenerateArchitectureDiagram = async () => {
    if (!project) return

    setIsGeneratingDiagram(true)
    try {
      const files = project.files?.map(file => ({
        path: file.name,
        // In a real app, you would include file content here
        content: `// Mock content for ${file.name}`,
      }))

      const result = await generateArchitectureDiagram(files!)

      if (result.success) {
        setArchitectureDiagrams(prev => ({
          ...prev,
          [String(projectId)]: {
            ...prev[String(projectId)],
            componentDiagram: result.mermaidCode,
            metadata: result.metadata,
            description: result.description,
          },
        }))

        toast.success('Architecture diagram generated successfully')
      } else {
        toast.error('Failed to generate architecture diagram', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('Error generating architecture diagram:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsGeneratingDiagram(false)
    }
  }

  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'full' ? 'split' : 'full'))
  }

  if (!projectId) {
    router.push('/projects')
    return
  }
  if (isLoading) {
    return <ProjectSkeleton />
  }

  if (!project) {
    return (
      <div className='flex items-center justify-center h-[50vh]'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
            <CardDescription>
              The requested project could not be found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant='outline' onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Function to get language from file extension
  const getLanguageFromExtension = (
    extension: string | undefined
  ): string | undefined => {
    switch (extension) {
      case 'ts':
      case 'tsx':
        return 'TypeScript'
      case 'js':
      case 'jsx':
        return 'JavaScript'
      case 'py':
        return 'Python'
      case 'java':
        return 'Java'
      case 'go':
        return 'Go'
      case 'rs':
        return 'Rust'
      default:
        return undefined
    }
  }

  return (
    <FileNavigationProvider
      projectFiles={project.files?.map(file => ({
        path: file.name,
        complexity: file.complexity,
        language:
          file.language ||
          getLanguageFromExtension(file.name.split('.').pop()?.toLowerCase()),
      }))}
    >
      <div className='space-y-6'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'
        >
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-3xl font-bold tracking-tight'>
                {project.name}
              </h2>
              <Badge variant='outline' className='font-normal rounded-full'>
                {project.language}
              </Badge>
            </div>
            <p className='text-muted-foreground'>{project.description}</p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <GenerateDocumentationButton
              projectId={projectId}
              projectName={project.name}
              repositoryUrl={project.repositoryUrl}
              language={project.language}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='rounded-full'
                    onClick={() => setShowExportDialog(true)}
                    disabled={!documentation}
                  >
                    <Download className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export Documentation</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button className='gap-2 rounded-full'>
              <Github className='h-4 w-4' />
              View on GitHub
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue='documentation' className='space-y-6'>
          <TabsList className='w-full justify-start gap-1 rounded-full p-1'>
            <TabsTrigger value='documentation' className='rounded-full gap-2'>
              <FileText className='h-4 w-4' />
              Documentation
            </TabsTrigger>
            <TabsTrigger value='insights' className='rounded-full gap-2'>
              <BarChart className='h-4 w-4' />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value='code' className='rounded-full gap-2'>
              <Code className='h-4 w-4' />
              Code Analysis
            </TabsTrigger>
            <TabsTrigger value='architecture' className='rounded-full gap-2'>
              <GitBranch className='h-4 w-4' />
              Architecture
            </TabsTrigger>
          </TabsList>

          <TabsContent value='documentation' className='space-y-6'>
            <div className='flex justify-end'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='gap-2'
                      onClick={toggleViewMode}
                    >
                      {viewMode === 'full' ? (
                        <>
                          <SplitSquareVertical className='h-4 w-4' />
                          Split View
                        </>
                      ) : (
                        <>
                          <Maximize2 className='h-4 w-4' />
                          Full View
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {viewMode === 'full'
                      ? 'Show documentation and file content side by side'
                      : 'Show full view'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div
              className={`grid gap-6 ${
                viewMode === 'split'
                  ? 'md:grid-cols-[300px_1fr_1fr]'
                  : 'md:grid-cols-[300px_1fr]'
              }`}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className='h-fit border-0 shadow-md elegant-card'>
                  <CardHeader className='elegant-card-header'>
                    <CardTitle>Project Structure</CardTitle>
                    <CardDescription>
                      Files and directories in this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileTree
                      items={buildFileTree(
                        project.files.map(file => ({
                          path: file.name,
                          complexity: file.complexity,
                        }))
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={viewMode === 'split' ? 'col-span-2' : ''}
              >
                {viewMode === 'split' ? (
                  <div className='grid grid-cols-2 gap-6 h-full'>
                    <DocumentationViewer
                      projectId={projectId}
                      enhanceFileReferences={true}
                    />
                    <FileContentViewer />
                  </div>
                ) : (
                  <DocumentationViewer
                    projectId={projectId}
                    enhanceFileReferences={true}
                  />
                )}
              </motion.div>
            </div>
          </TabsContent>
          <TabsContent value='insights' className='space-y-6'>
            {documentation && (
              <DocumentationAIInsights {...{ project, documentation }} />
            )}
          </TabsContent>

          <TabsContent value='code' className='space-y-6'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CodeAnalysis
                projectId={projectId}
                statistics={
                  documentation
                    ? {
                        totalFiles: documentation.statistics.totalFiles,
                        totalLinesOfCode:
                          documentation.statistics.totalLinesOfCode,
                        components: documentation.statistics.components || 0,
                        customHooks: documentation.statistics.customHooks || 0,
                      }
                    : {
                        totalFiles: project.files?.length,
                        totalLinesOfCode: 3245,
                        components: project.componentFiles?.length,
                        customHooks: project.hookFiles?.length,
                      }
                }
                componentFiles={project.componentFiles}
                hookFiles={project.hookFiles}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value='architecture' className='space-y-6'>
            <div className='flex justify-end'>
              <Button
                variant='outline'
                size='sm'
                className='gap-2'
                onClick={handleGenerateArchitectureDiagram}
                disabled={isGeneratingDiagram}
              >
                {isGeneratingDiagram ? (
                  <>
                    <RefreshCw className='h-4 w-4 animate-spin' />
                    Generating...
                  </>
                ) : (
                  <>
                    <GitBranch className='h-4 w-4' />
                    Generate Architecture Diagram
                  </>
                )}
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {architectureDiagrams[projectId].componentDiagram ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className='space-y-4'>
                    <h2 className='text-2xl font-bold tracking-tight'>
                      Architecture Diagrams
                    </h2>
                    <ArchitectureDiagram
                      mermaidCode={
                        architectureDiagrams[projectId].componentDiagram
                      }
                      metadata={architectureDiagrams[projectId]?.metadata}
                      description={architectureDiagrams[projectId]?.description}
                      projectId={projectId}
                      title='Project Architecture'
                    />
                  </div>
                </motion.div>
              ) : (
                <div className='space-y-6'>
                  <Card className='border-0 shadow-md elegant-card'>
                    <CardHeader className='elegant-card-header'>
                      <CardTitle>Architecture Diagram</CardTitle>
                      <CardDescription>
                        Generate an AI-powered visualization of your project
                        architecture
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center justify-center p-12 text-center'>
                      <GitBranch className='h-16 w-16 text-muted-foreground mb-4 opacity-20' />
                      <h3 className='text-lg font-medium mb-2'>
                        No Architecture Diagram Available
                      </h3>
                      <p className='text-muted-foreground mb-6 max-w-md'>
                        Click the &quot;Generate Architecture Diagram&quot;
                        button to have AI analyze your project structure and
                        create a visual representation of component
                        relationships.
                      </p>
                      <Button
                        onClick={handleGenerateArchitectureDiagram}
                        disabled={isGeneratingDiagram}
                        className='gap-2'
                      >
                        {isGeneratingDiagram ? (
                          <>
                            <RefreshCw className='h-4 w-4 animate-spin' />
                            Generating...
                          </>
                        ) : (
                          <>
                            <GitBranch className='h-4 w-4' />
                            Generate Architecture Diagram
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
        <ExportDocumentationDialog
          documentation={documentation!}
          {...{ showExportDialog, setShowExportDialog }}
        />
      </div>
    </FileNavigationProvider>
  )
}
