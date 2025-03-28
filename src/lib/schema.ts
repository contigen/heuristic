import { z } from 'zod'

// Schema for code complexity analysis
const complexityAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  level: z.enum(['low', 'medium', 'high']),
  details: z.string().optional(),
})

// Schema for file metadata
const fileSchema = z.object({
  path: z.string(),
  name: z.string(),
  language: z.string().nullable(),
  content: z.string(),
  complexity: complexityAnalysisSchema,
  linesOfCode: z.number().int().positive(),
})

// Schema for code suggestions
const codeSnippetSchema = z.object({
  code: z.string(),
  language: z.string(),
  lineNumbers: z.boolean().default(true),
})

const suggestionSchema = z.object({
  id: z.string().optional(), // Removed .uuid() format
  title: z.string(),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  file: z.string(),
  lineNumber: z.number().int().positive().optional(),
  suggestedCode: codeSnippetSchema.optional(),
  originalCode: codeSnippetSchema.optional(),
})

// Schema for documentation sections
const documentationSectionSchema = z.object({
  title: z.string(),
  content: z.string(),
  codeExamples: z.array(codeSnippetSchema).optional(),
})

// Schema for pull request analysis
const pullRequestAnalysisSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['open', 'merged', 'closed']),
  summary: z.string(),
  keyChanges: z.array(z.string()),
  author: z.string(),
  mergedAt: z.string().optional(),
})

// Schema for AI notes
const aiNoteSchema = z.object({
  id: z.string().optional(), // Removed .uuid() format
  title: z.string().optional(),
  content: z.string(),
  type: z.enum(['info', 'warning', 'suggestion']).default('info'),
  relatedFiles: z.array(z.string()).optional(),
})

// Create a custom validator for grade strings that also accepts null
// Instead of using union types, we'll use a string with a more permissive regex
// that includes the valid grade format and also allows null
const gradeStringSchema = z
  .string()
  .regex(/^([A-F][+-]?|null)$/)
  .nullable()

// Main documentation schema
export const projectDocumentationSchema = z.object({
  // Project metadata
  projectId: z.string(),
  projectName: z.string(),
  repositoryUrl: z.string().optional(), // Removed .url() format
  language: z.string().nullable(),
  lastAnalyzed: z.string().optional(), // Removed .datetime() format

  // Documentation content
  overview: z.string(),
  sections: z.array(documentationSectionSchema),
  aiNotes: z.array(aiNoteSchema),

  // Code analysis
  files: z.array(fileSchema),
  codeQuality: z.object({
    score: z.number().min(0).max(100),
    grade: z.string().regex(/^[A-F][+-]?$/),
    previousScore: z.number().min(0).max(100).optional(),
    // Use nullable() instead of union types
    previousGrade: gradeStringSchema.optional(),
  }),

  // Technical debt
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

  // Test coverage
  testCoverage: z.object({
    percentage: z.number().min(0).max(100),
    uncoveredFiles: z.array(z.string()).optional(),
  }),

  // Code duplication
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

  // Refactoring suggestions
  suggestions: z.array(suggestionSchema),

  // Pull request analysis
  pullRequests: z.array(pullRequestAnalysisSchema).optional(),

  // Project statistics
  statistics: z.object({
    totalFiles: z.number().int().nonnegative(),
    totalLinesOfCode: z.number().int().nonnegative(),
    components: z.number().int().nonnegative().optional(),
    customHooks: z.number().int().nonnegative().optional(),
    dependencies: z.number().int().nonnegative().optional(),
  }),
})

// Type for the documentation schema
export type ProjectDocumentation = z.infer<typeof projectDocumentationSchema>
