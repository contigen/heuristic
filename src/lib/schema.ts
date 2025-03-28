import { z } from 'zod'

const complexityAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  level: z.enum(['low', 'medium', 'high']),
  details: z.string().optional(),
})

const fileSchema = z.object({
  path: z.string(),
  name: z.string(),
  language: z.string().nullable(),
  content: z.string(),
  complexity: complexityAnalysisSchema,
  linesOfCode: z.number().int().positive(),
})

const codeSnippetSchema = z.object({
  code: z.string(),
  language: z.string(),
  lineNumbers: z.boolean().default(true),
})

const suggestionSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  file: z.string(),
  lineNumber: z.number().int().positive().optional(),
  suggestedCode: codeSnippetSchema.optional(),
  originalCode: codeSnippetSchema.optional(),
})

const documentationSectionSchema = z.object({
  title: z.string(),
  content: z.string(),
  codeExamples: z.array(codeSnippetSchema).optional(),
})

const pullRequestAnalysisSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['open', 'merged', 'closed']),
  summary: z.string(),
  keyChanges: z.array(z.string()),
  author: z.string(),
  mergedAt: z.string().optional(),
})

const aiNoteSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  content: z.string(),
  type: z.enum(['info', 'warning', 'suggestion']).default('info'),
  relatedFiles: z.array(z.string()).optional(),
})

const gradeStringSchema = z
  .string()
  .regex(/^([A-F][+-]?|null)$/)
  .nullable()

export const projectDocumentationSchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  repositoryUrl: z.string().optional(),
  language: z.string().nullable(),
  lastAnalyzed: z.string().optional(),

  overview: z.string(),
  sections: z.array(documentationSectionSchema),
  aiNotes: z.array(aiNoteSchema),

  files: z.array(fileSchema),
  codeQuality: z.object({
    score: z.number().min(0).max(100),
    grade: z.string().regex(/^[A-F][+-]?$/),
    previousScore: z.number().min(0).max(100).optional(),
    previousGrade: gradeStringSchema.optional(),
  }),

  technicalDebt: z.object({
    todos: z.array(
      z.object({
        text: z.string(),
        file: z.string(),
        lineNumber: z.number().int().positive(),
      })
    ),
    fixmes: z.array(
      z.object({
        text: z.string(),
        file: z.string(),
        lineNumber: z.number().int().positive(),
      })
    ),
    deprecatedApiUsage: z.array(
      z.object({
        api: z.string(),
        file: z.string(),
        lineNumber: z.number().int().positive(),
        suggestion: z.string().optional(),
      })
    ),
  }),

  testCoverage: z.object({
    percentage: z.number().min(0).max(100),
    uncoveredFiles: z.array(z.string()).optional(),
  }),

  codeDuplication: z.object({
    percentage: z.number().min(0).max(100),
    instances: z
      .array(
        z.object({
          files: z.array(z.string()),
          linesOfCode: z.number().int().positive(),
        })
      )
      .optional(),
  }),

  suggestions: z.array(suggestionSchema),

  pullRequests: z.array(pullRequestAnalysisSchema).optional(),

  statistics: z.object({
    totalFiles: z.number().int().nonnegative(),
    totalLinesOfCode: z.number().int().nonnegative(),
    components: z.number().int().nonnegative().optional(),
    customHooks: z.number().int().nonnegative().optional(),
    dependencies: z.number().int().nonnegative().optional(),
  }),
})

export type ProjectDocumentation = z.infer<typeof projectDocumentationSchema>
