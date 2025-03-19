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
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Download,
  FileCode,
  Github,
  RefreshCw,
  Code,
  FileText,
  AlertTriangle,
  BarChart,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function ProjectPage() {
  const { id } = useParams()
  const [isGenerating, setIsGenerating] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportFormat, setExportFormat] = useState('markdown')
  const [isExporting, setIsExporting] = useState(false)
  const [includeSections, setIncludeSections] = useState({
    overview: true,
    components: true,
    utilities: true,
    codeExamples: true,
    aiNotes: true,
  })

  // Mock project data
  const project = {
    id: id as string,
    name: 'frontend-app',
    description: 'React frontend application with TypeScript',
    lastUpdated: '2 hours ago',
    stars: 24,
    language: 'TypeScript',
    contributors: [
      { name: 'Alex Johnson', avatar: '/placeholder.svg?height=32&width=32' },
      { name: 'Maria Garcia', avatar: '/placeholder.svg?height=32&width=32' },
      { name: 'Sam Taylor', avatar: '/placeholder.svg?height=32&width=32' },
    ],
    files: [
      { name: 'src/components/Button.tsx', complexity: 'low' },
      { name: 'src/components/Modal.tsx', complexity: 'medium' },
      { name: 'src/utils/api.ts', complexity: 'low' },
      { name: 'src/hooks/useAuth.ts', complexity: 'medium' },
      { name: 'src/pages/Dashboard.tsx', complexity: 'high' },
    ],
  }

  const handleGenerateDocumentation = () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      toast.info('Documentation Generated', {
        description: 'Documentation has been successfully regenerated.',
      })
    }, 3000)
  }

  const handleExportDocumentation = () => {
    setIsExporting(true)
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      setShowExportDialog(false)
      toast.message('Documentation Exported', {
        description: `Documentation has been exported as ${exportFormat.toUpperCase()}.`,
      })
    }, 2000)
  }

  const handleSectionChange = (section: string, checked: boolean) => {
    setIncludeSections(prev => ({
      ...prev,
      [section]: checked,
    }))
  }

  return (
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
          <Button
            variant='outline'
            className='gap-2 rounded-full'
            onClick={handleGenerateDocumentation}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className='w-4 h-4 animate-spin' />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className='w-4 h-4' />
                Regenerate Documentation
              </>
            )}
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='rounded-full'
                  onClick={() => setShowExportDialog(true)}
                >
                  <Download className='w-4 h-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export Documentation</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button className='gap-2 rounded-full'>
            <Github className='w-4 h-4' />
            View on GitHub
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue='documentation' className='space-y-6'>
        <TabsList className='justify-start w-full gap-1 p-1 rounded-full'>
          <TabsTrigger value='documentation' className='gap-2 rounded-full'>
            <FileText className='w-4 h-4' />
            Documentation
          </TabsTrigger>
          <TabsTrigger value='insights' className='gap-2 rounded-full'>
            <BarChart className='w-4 h-4' />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value='code' className='gap-2 rounded-full'>
            <Code className='w-4 h-4' />
            Code Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value='documentation' className='space-y-6'>
          <div className='grid gap-6 md:grid-cols-[300px_1fr]'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className='border-0 shadow-md h-fit'>
                <CardHeader className='elegant-card-header'>
                  <CardTitle>Project Structure</CardTitle>
                  <CardDescription>
                    Files and directories in this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className='h-[400px] pr-4'>
                    <div className='space-y-1'>
                      {project.files.map((file, index) => (
                        <motion.div
                          key={file.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className='flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted'
                        >
                          <FileCode className='w-4 h-4 text-primary' />
                          <span className='text-sm'>{file.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className='h-full border-0 shadow-md'>
                <CardHeader className='border-b bg-gradient-to-r from-primary/10 to-transparent'>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>
                    AI-generated documentation for this project
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='space-y-4'>
                    <h3 className='text-xl font-semibold gradient-text'>
                      Overview
                    </h3>
                    <p>
                      This is a React frontend application built with
                      TypeScript. It provides a user interface for managing and
                      visualizing data. The application uses modern React
                      patterns including hooks and context for state management.
                    </p>

                    <h4 className='text-lg font-medium'>Key Components</h4>
                    <ul className='pl-6 space-y-2 list-disc'>
                      <li>
                        <strong>Button</strong> - A reusable button component
                        with various styles and states.
                      </li>
                      <li>
                        <strong>Modal</strong> - A modal dialog component for
                        displaying content that requires user interaction.
                      </li>
                      <li>
                        <strong>Dashboard</strong> - The main dashboard page
                        that displays user data and analytics.
                      </li>
                    </ul>

                    <h4 className='text-lg font-medium'>Utilities</h4>
                    <ul className='pl-6 space-y-2 list-disc'>
                      <li>
                        <strong>api.ts</strong> - Utility functions for making
                        API requests.
                      </li>
                      <li>
                        <strong>useAuth</strong> - A custom hook for handling
                        authentication state.
                      </li>
                    </ul>

                    <div className='overflow-hidden shadow-md code-block rounded-xl'>
                      <div className='code-block-header bg-primary/10 text-primary'>
                        <span>Button.tsx</span>
                      </div>
                      <div className='code-block-content bg-muted/30'>
                        <pre>
                          {`import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
}) => {
  // Implementation details...
};`}
                        </pre>
                      </div>
                    </div>

                    <div className='p-4 border rounded-xl bg-primary/5 border-primary/10'>
                      <div className='flex items-center gap-2'>
                        <AlertTriangle className='w-5 h-5 text-primary' />
                        <h4 className='font-medium'>AI Note</h4>
                      </div>
                      <p className='mt-2 text-sm'>
                        The <span className='ai-highlight'>useAuth</span> hook
                        could benefit from additional error handling and refresh
                        token logic. Consider implementing token refresh
                        functionality to improve user experience.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value='insights' className='space-y-6'>
          <div className='grid gap-6 md:grid-cols-2'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className='border-0 shadow-md elegant-card'>
                <CardHeader className='elegant-card-header'>
                  <CardTitle>Code Complexity</CardTitle>
                  <CardDescription>
                    Analysis of code complexity across the project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      {project.files.map((file, index) => (
                        <motion.div
                          key={file.name}
                          className='space-y-1'
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <div className='flex items-center justify-between text-sm'>
                            <span>{file.name}</span>
                            <span className='font-medium capitalize'>
                              {file.complexity}
                            </span>
                          </div>
                          <div
                            className={`h-2 rounded-full ${
                              file.complexity === 'low'
                                ? 'complexity-low'
                                : file.complexity === 'medium'
                                ? 'complexity-medium'
                                : 'complexity-high'
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className='border-0 shadow-md elegant-card'>
                <CardHeader className='elegant-card-header'>
                  <CardTitle>Refactoring Suggestions</CardTitle>
                  <CardDescription>
                    AI-powered recommendations to improve code quality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='p-4 border shadow-sm rounded-xl bg-gradient-to-r from-red-500/5 to-transparent'>
                      <h4 className='font-medium'>
                        Dashboard.tsx - High Complexity
                      </h4>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        This component has too many responsibilities and should
                        be split into smaller components.
                      </p>
                      <div className='mt-2'>
                        <div className='text-sm ai-suggestion'>
                          <p>
                            Consider extracting the data visualization section
                            into a separate component:
                          </p>
                          <pre className='p-2 mt-2 text-xs rounded-md bg-muted/30'>
                            {`// Extract this section
const DataVisualization = ({ data }) => {
  return (
    <div className="charts">
      {/* Chart components */}
    </div>
  );
};`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className='p-4 border shadow-sm rounded-xl bg-gradient-to-r from-yellow-500/5 to-transparent'>
                      <h4 className='font-medium'>
                        useAuth.ts - Improve Error Handling
                      </h4>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        The authentication hook lacks comprehensive error
                        handling.
                      </p>
                      <div className='mt-2'>
                        <div className='text-sm ai-suggestion'>
                          <p>Add more specific error handling:</p>
                          <pre className='p-2 mt-2 text-xs rounded-md bg-muted/30'>
                            {`try {
  // Authentication logic
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 403) {
    // Handle forbidden
  } else {
    // Handle other errors
  }
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className='border-0 shadow-md elegant-card'>
              <CardHeader className='elegant-card-header'>
                <CardTitle>Pull Request Analysis</CardTitle>
                <CardDescription>
                  Recent pull requests with AI-generated summaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='p-4 border shadow-sm rounded-xl bg-gradient-to-r from-primary/5 to-transparent'>
                    <div className='flex items-center justify-between'>
                      <h4 className='font-medium'>
                        Add user authentication (#42)
                      </h4>
                      <Badge className='text-green-600 rounded-full bg-green-500/10 dark:bg-green-500/20 dark:text-green-400'>
                        Merged
                      </Badge>
                    </div>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      Merged 3 days ago by Alex Johnson
                    </p>
                    <div className='p-3 mt-3 rounded-md bg-muted/30'>
                      <h5 className='text-sm font-medium'>AI Summary</h5>
                      <p className='mt-1 text-sm'>
                        This PR implements user authentication using JWT tokens.
                        It adds a login form, registration form, and the useAuth
                        hook for managing authentication state. The
                        implementation follows best practices for secure
                        authentication.
                      </p>
                      <div className='mt-2 text-sm'>
                        <span className='font-medium'>Key changes:</span>
                        <ul className='pl-5 mt-1 list-disc'>
                          <li>Added useAuth hook for authentication state</li>
                          <li>Implemented login and registration forms</li>
                          <li>Added protected route component</li>
                          <li>Integrated with backend authentication API</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className='p-4 border shadow-sm rounded-xl bg-gradient-to-r from-primary/5 to-transparent'>
                    <div className='flex items-center justify-between'>
                      <h4 className='font-medium'>
                        Refactor data fetching logic (#39)
                      </h4>
                      <Badge className='text-green-600 rounded-full bg-green-500/10 dark:bg-green-500/20 dark:text-green-400'>
                        Merged
                      </Badge>
                    </div>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      Merged 5 days ago by Maria Garcia
                    </p>
                    <div className='p-3 mt-3 rounded-md bg-muted/30'>
                      <h5 className='text-sm font-medium'>AI Summary</h5>
                      <p className='mt-1 text-sm'>
                        This PR refactors the data fetching logic to use React
                        Query for better caching and state management. It
                        improves performance and reduces unnecessary API calls.
                      </p>
                      <div className='mt-2 text-sm'>
                        <span className='font-medium'>Key changes:</span>
                        <ul className='pl-5 mt-1 list-disc'>
                          <li>Replaced custom fetch hooks with React Query</li>
                          <li>
                            Implemented query caching for improved performance
                          </li>
                          <li>
                            Added loading and error states for data fetching
                          </li>
                          <li>
                            Updated components to use the new data fetching
                            pattern
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value='code' className='space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className='border-0 shadow-md elegant-card'>
              <CardHeader className='elegant-card-header'>
                <CardTitle>Code Analysis</CardTitle>
                <CardDescription>
                  Detailed analysis of the codebase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-medium gradient-text'>
                      Project Statistics
                    </h3>
                    <div className='grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4'>
                      {[
                        { label: 'Total Files', value: '42' },
                        { label: 'Lines of Code', value: '3,245' },
                        { label: 'Components', value: '18' },
                        { label: 'Custom Hooks', value: '7' },
                      ].map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <div className='p-4 border rounded-xl bg-gradient-to-br from-muted/50 to-transparent'>
                            <div className='text-sm font-medium text-muted-foreground'>
                              {stat.label}
                            </div>
                            <div className='mt-1 text-2xl font-bold'>
                              {stat.value}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className='text-lg font-medium gradient-text'>
                      Code Quality
                    </h3>
                    <div className='mt-4 space-y-4'>
                      <div className='grid gap-4 sm:grid-cols-2'>
                        <div className='p-4 border shadow-sm rounded-xl'>
                          <div className='text-sm font-medium'>
                            Test Coverage
                          </div>
                          <div className='flex items-center gap-2 mt-2'>
                            <div className='w-full h-2 rounded-full bg-muted'>
                              <div className='h-2 w-[65%] rounded-full bg-green-500' />
                            </div>
                            <span className='text-sm font-medium'>65%</span>
                          </div>
                        </div>
                        <div className='p-4 border shadow-sm rounded-xl'>
                          <div className='text-sm font-medium'>
                            Code Duplication
                          </div>
                          <div className='flex items-center gap-2 mt-2'>
                            <div className='w-full h-2 rounded-full bg-muted'>
                              <div className='h-2 w-[12%] rounded-full bg-yellow-500' />
                            </div>
                            <span className='text-sm font-medium'>12%</span>
                          </div>
                        </div>
                      </div>

                      <div className='p-4 border shadow-sm rounded-xl'>
                        <h4 className='text-sm font-medium'>Technical Debt</h4>
                        <div className='mt-3 space-y-2'>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm'>TODOs</span>
                            <Badge variant='outline' className='rounded-full'>
                              8
                            </Badge>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm'>FIXMEs</span>
                            <Badge variant='outline' className='rounded-full'>
                              3
                            </Badge>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm'>
                              Deprecated API Usage
                            </span>
                            <Badge variant='outline' className='rounded-full'>
                              2
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Export Documentation Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Export Documentation</DialogTitle>
            <DialogDescription>
              Choose your preferred format and options for exporting the
              documentation.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='format'>Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id='format'>
                  <SelectValue placeholder='Select format' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='markdown'>Markdown (.md)</SelectItem>
                  <SelectItem value='pdf'>PDF Document (.pdf)</SelectItem>
                  <SelectItem value='html'>HTML (.html)</SelectItem>
                  <SelectItem value='json'>JSON (.json)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='mt-2 space-y-4'>
              <Label>Include Sections</Label>
              <div className='grid grid-cols-2 gap-2'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='overview'
                    checked={includeSections.overview}
                    onCheckedChange={checked =>
                      handleSectionChange('overview', checked as boolean)
                    }
                  />
                  <Label htmlFor='overview'>Overview</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='components'
                    checked={includeSections.components}
                    onCheckedChange={checked =>
                      handleSectionChange('components', checked as boolean)
                    }
                  />
                  <Label htmlFor='components'>Components</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='utilities'
                    checked={includeSections.utilities}
                    onCheckedChange={checked =>
                      handleSectionChange('utilities', checked as boolean)
                    }
                  />
                  <Label htmlFor='utilities'>Utilities</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='code-examples'
                    checked={includeSections.codeExamples}
                    onCheckedChange={checked =>
                      handleSectionChange('codeExamples', checked as boolean)
                    }
                  />
                  <Label htmlFor='code-examples'>Code Examples</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='ai-notes'
                    checked={includeSections.aiNotes}
                    onCheckedChange={checked =>
                      handleSectionChange('aiNotes', checked as boolean)
                    }
                  />
                  <Label htmlFor='ai-notes'>AI Notes</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowExportDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExportDocumentation}
              disabled={isExporting}
              className='gap-2'
            >
              {isExporting ? (
                <>
                  <RefreshCw className='w-4 h-4 animate-spin' />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className='w-4 h-4' />
                  Export
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
