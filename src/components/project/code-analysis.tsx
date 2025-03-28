'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileReference } from '@/components/project/file-reference'
import { motion } from 'framer-motion'
import { useFileNavigation } from '@/components/project/file-navigation-context'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react'

interface CodeAnalysisProps {
  statistics: {
    totalFiles: number
    totalLinesOfCode: number
    components: number
    customHooks: number
  }
  componentFiles: string[]
  hookFiles: string[]
}

export function CodeAnalysis({
  statistics,
  componentFiles,
  hookFiles,
}: CodeAnalysisProps) {
  const { navigateToFile } = useFileNavigation()

  // Mock data for code quality metrics
  const codeQualityMetrics = {
    duplication: {
      percentage: 4.2,
      files: [
        {
          path: 'src/components/Button.tsx',
          duplicateWith: 'src/components/IconButton.tsx',
          lines: 12,
        },
        {
          path: 'src/utils/api.ts',
          duplicateWith: 'src/utils/fetch.ts',
          lines: 8,
        },
      ],
    },
    coverage: {
      percentage: 68.5,
      uncoveredFiles: [
        { path: 'src/pages/Dashboard.tsx', coverage: 42.3 },
        { path: 'src/hooks/useAuth.ts', coverage: 51.7 },
      ],
    },
    todos: [
      {
        path: 'src/components/Table.tsx',
        line: 45,
        message: 'TODO: Add pagination support',
      },
      {
        path: 'src/hooks/useData.ts',
        line: 78,
        message: 'TODO: Implement caching mechanism',
      },
      {
        path: 'src/utils/validation.ts',
        line: 23,
        message: 'TODO: Add more validation rules',
      },
    ],
    fixmes: [
      {
        path: 'src/pages/Settings.tsx',
        line: 112,
        message: 'FIXME: Form validation not working correctly',
      },
      {
        path: 'src/components/Modal.tsx',
        line: 67,
        message: 'FIXME: Animation glitches on Safari',
      },
    ],
    deprecatedApis: [
      {
        path: 'src/utils/api.ts',
        line: 34,
        api: 'fetch',
        recommendation: 'Use axios or custom fetch wrapper',
      },
      {
        path: 'src/components/Form.tsx',
        line: 89,
        api: 'componentWillMount',
        recommendation: 'Use useEffect hook',
      },
    ],
  }

  return (
    <div className='space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className='border-0 shadow-md elegant-card'>
          <CardHeader className='elegant-card-header'>
            <CardTitle>File Statistics</CardTitle>
            <CardDescription>
              Overview of files and code in this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='bg-primary/5 p-4 rounded-lg text-center'>
                <div className='text-3xl font-bold'>
                  {statistics.totalFiles}
                </div>
                <div className='text-sm text-muted-foreground mt-1'>
                  Total Files
                </div>
              </div>
              <div className='bg-primary/5 p-4 rounded-lg text-center'>
                <div className='text-3xl font-bold'>
                  {statistics.totalLinesOfCode.toLocaleString()}
                </div>
                <div className='text-sm text-muted-foreground mt-1'>
                  Lines of Code
                </div>
              </div>
              <div className='bg-primary/5 p-4 rounded-lg text-center'>
                <div className='text-3xl font-bold'>
                  {statistics.components}
                </div>
                <div className='text-sm text-muted-foreground mt-1'>
                  Components
                </div>
              </div>
              <div className='bg-primary/5 p-4 rounded-lg text-center'>
                <div className='text-3xl font-bold'>
                  {statistics.customHooks}
                </div>
                <div className='text-sm text-muted-foreground mt-1'>
                  Custom Hooks
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Components and Hooks */}
      <div className='grid gap-6 md:grid-cols-2'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className='border-0 shadow-md h-full elegant-card'>
            <CardHeader className='elegant-card-header'>
              <CardTitle>Components</CardTitle>
              <CardDescription>
                React components in this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {componentFiles.map(file => (
                  <div
                    key={file}
                    className='flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer'
                    onClick={() => navigateToFile(file)}
                  >
                    <FileReference filePath={file} />
                    <Badge variant='outline' className='text-xs'>
                      Component
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className='border-0 shadow-md h-full elegant-card'>
            <CardHeader className='elegant-card-header'>
              <CardTitle>Custom Hooks</CardTitle>
              <CardDescription>React hooks in this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {hookFiles.map(file => (
                  <div
                    key={file}
                    className='flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer'
                    onClick={() => navigateToFile(file)}
                  >
                    <FileReference filePath={file} />
                    <Badge variant='outline' className='text-xs'>
                      Hook
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Code Quality Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className='border-0 shadow-md elegant-card'>
          <CardHeader className='elegant-card-header'>
            <CardTitle>Code Quality Metrics</CardTitle>
            <CardDescription>
              Analysis of code quality and potential issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {/* Code Duplication */}
              <div>
                <h3 className='text-lg font-medium mb-2 flex items-center'>
                  <AlertCircle className='h-5 w-5 mr-2 text-yellow-500' />
                  Code Duplication
                  <Badge className='ml-2' variant='outline'>
                    {codeQualityMetrics.duplication.percentage}%
                  </Badge>
                </h3>
                <div className='space-y-2'>
                  {codeQualityMetrics.duplication.files.map((item, index) => (
                    <Alert
                      key={index}
                      variant='destructive'
                      className='bg-yellow-500/5 border-yellow-500/20'
                    >
                      <AlertTitle className='flex items-center text-sm font-medium'>
                        Duplicate code detected
                      </AlertTitle>
                      <AlertDescription className='text-xs mt-1'>
                        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                          <div>
                            <span className='font-medium'>
                              <FileReference
                                filePath={item.path}
                                onClick={() => navigateToFile(item.path)}
                              />
                            </span>{' '}
                            has {item.lines} lines of duplicate code with{' '}
                            <FileReference
                              filePath={item.duplicateWith}
                              onClick={() => navigateToFile(item.duplicateWith)}
                            />
                          </div>
                          <Badge variant='outline' className='shrink-0'>
                            {item.lines} lines
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>

              {/* Code Coverage */}
              <div>
                <h3 className='text-lg font-medium mb-2 flex items-center'>
                  <CheckCircle2 className='h-5 w-5 mr-2 text-blue-500' />
                  Code Coverage
                  <Badge className='ml-2' variant='outline'>
                    {codeQualityMetrics.coverage.percentage}%
                  </Badge>
                </h3>
                <div className='space-y-2'>
                  {codeQualityMetrics.coverage.uncoveredFiles.map(
                    (item, index) => (
                      <Alert
                        key={index}
                        variant='destructive'
                        className='bg-blue-500/5 border-blue-500/20'
                      >
                        <AlertTitle className='flex items-center text-sm font-medium'>
                          Low test coverage
                        </AlertTitle>
                        <AlertDescription className='text-xs mt-1'>
                          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                            <div>
                              <span className='font-medium'>
                                <FileReference
                                  filePath={item.path}
                                  onClick={() => navigateToFile(item.path)}
                                />
                              </span>{' '}
                              has low test coverage
                            </div>
                            <Badge variant='outline' className='shrink-0'>
                              {item.coverage}%
                            </Badge>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )
                  )}
                </div>
              </div>

              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <h3 className='text-lg font-medium mb-2 flex items-center'>
                    <Info className='h-5 w-5 mr-2 text-blue-500' />
                    TODOs
                    <Badge className='ml-2' variant='outline'>
                      {codeQualityMetrics.todos.length}
                    </Badge>
                  </h3>
                  <div className='space-y-2'>
                    {codeQualityMetrics.todos.map((item, index) => (
                      <div
                        key={index}
                        className='p-2 rounded-md bg-muted/30 text-xs'
                        onClick={() => navigateToFile(item.path)}
                      >
                        <div className='flex items-center justify-between'>
                          <FileReference filePath={item.path} />
                          <Badge variant='outline' className='text-xs'>
                            Line {item.line}
                          </Badge>
                        </div>
                        <div className='mt-1 text-muted-foreground'>
                          {item.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className='text-lg font-medium mb-2 flex items-center'>
                    <AlertTriangle className='h-5 w-5 mr-2 text-orange-500' />
                    FIXMEs
                    <Badge className='ml-2' variant='outline'>
                      {codeQualityMetrics.fixmes.length}
                    </Badge>
                  </h3>
                  <div className='space-y-2'>
                    {codeQualityMetrics.fixmes.map((item, index) => (
                      <div
                        key={index}
                        className='p-2 rounded-md bg-muted/30 text-xs'
                        onClick={() => navigateToFile(item.path)}
                      >
                        <div className='flex items-center justify-between'>
                          <FileReference filePath={item.path} />
                          <Badge variant='outline' className='text-xs'>
                            Line {item.line}
                          </Badge>
                        </div>
                        <div className='mt-1 text-muted-foreground'>
                          {item.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-medium mb-2 flex items-center'>
                  <AlertTriangle className='h-5 w-5 mr-2 text-red-500' />
                  Deprecated API Usage
                  <Badge className='ml-2' variant='outline'>
                    {codeQualityMetrics.deprecatedApis.length}
                  </Badge>
                </h3>
                <div className='space-y-2'>
                  {codeQualityMetrics.deprecatedApis.map((item, index) => (
                    <Alert
                      key={index}
                      variant='destructive'
                      className='bg-red-500/5 border-red-500/20'
                    >
                      <AlertTitle className='flex items-center text-sm font-medium'>
                        Deprecated API: {item.api}
                      </AlertTitle>
                      <AlertDescription className='text-xs mt-1'>
                        <div className='flex flex-col gap-1'>
                          <div className='flex items-center justify-between'>
                            <FileReference
                              filePath={item.path}
                              onClick={() => navigateToFile(item.path)}
                            />
                            <Badge variant='outline' className='text-xs'>
                              Line {item.line}
                            </Badge>
                          </div>
                          <div className='text-muted-foreground'>
                            Recommendation: {item.recommendation}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
