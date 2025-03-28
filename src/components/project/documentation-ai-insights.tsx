import { motion } from 'framer-motion'
import { Badge } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card'
import { FileReference } from './file-reference'
import { Project } from '@/types'
import { ProjectDocumentation } from '@/lib/schema'

export function DocumentationAIInsights({
  project,
  documentation,
}: {
  project: Project
  documentation: ProjectDocumentation
}) {
  return (
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
                {project.files?.map((file, index) => (
                  <motion.div
                    key={file.name}
                    className='space-y-1'
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className='flex items-center justify-between text-sm'>
                      <FileReference filePath={file.name} />
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
            {documentation ? (
              <div className='space-y-4'>
                {documentation.suggestions &&
                documentation.suggestions.length > 0 ? (
                  documentation.suggestions
                    .slice(0, 2)
                    .map((suggestion, index) => (
                      <div
                        key={index}
                        className='rounded-xl border p-4 shadow-sm bg-gradient-to-r from-primary/5 to-transparent'
                      >
                        <div className='flex items-center justify-between'>
                          <h4 className='font-medium'>{suggestion.title}</h4>
                          <Badge
                            className={`rounded-full ${
                              suggestion.priority === 'high'
                                ? 'bg-red-500/10 text-red-600'
                                : suggestion.priority === 'medium'
                                ? 'bg-yellow-500/10 text-yellow-600'
                                : 'bg-green-500/10 text-green-600'
                            }`}
                          >
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <p className='mt-1 text-sm text-muted-foreground'>
                          {suggestion.description}
                        </p>
                        <div className='mt-2 text-sm'>
                          <span className='font-medium'>File:</span>{' '}
                          <FileReference
                            filePath={suggestion.file || 'unknown'}
                          />
                        </div>
                        {suggestion.suggestedCode && (
                          <div className='mt-2 bg-muted/30 p-2 rounded-md'>
                            <pre className='text-xs overflow-auto'>
                              <code>{suggestion.suggestedCode.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    ))
                ) : (
                  <div className='text-center p-4 text-muted-foreground'>
                    No refactoring suggestions available
                  </div>
                )}
              </div>
            ) : (
              <div className='space-y-4'>
                {project.suggestions?.map((suggestion, index) => (
                  <div
                    key={index}
                    className='rounded-xl border p-4 shadow-sm bg-gradient-to-r from-primary/5 to-transparent'
                  >
                    <div className='flex items-center justify-between'>
                      <h4 className='font-medium'>{suggestion.title}</h4>
                      <Badge
                        className={`rounded-full ${
                          suggestion.priority === 'high'
                            ? 'bg-red-500/10 text-red-600'
                            : suggestion.priority === 'medium'
                            ? 'bg-yellow-500/10 text-yellow-600'
                            : 'bg-green-500/10 text-green-600'
                        }`}
                      >
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      {suggestion.description}
                    </p>
                    <div className='mt-2 text-sm'>
                      <span className='font-medium'>File:</span>{' '}
                      <FileReference filePath={suggestion.filePath} />
                    </div>
                    {suggestion.suggestedCode && (
                      <div className='mt-2 bg-muted/30 p-2 rounded-md'>
                        <pre className='text-xs overflow-auto'>
                          <code>{suggestion.suggestedCode.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
