'use server'

import { revalidatePath } from 'next/cache'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import {
  projectDocumentationSchema,
  type ProjectDocumentation,
} from '@/lib/schema'
import { z } from 'zod'

// Input schema for the generate documentation action
const generateDocumentationInputSchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  repositoryUrl: z.string().optional(),
  language: z.string().nullable().optional(),
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
      language: z.string().nullable().optional(),
    })
  ),
  // Optional context to provide additional information
  context: z
    .object({
      description: z.string().optional(),
      dependencies: z.record(z.string()).optional(),
      contributors: z.array(z.string()).optional(),
    })
    .optional(),
})

type GenerateDocumentationInput = z.infer<
  typeof generateDocumentationInputSchema
>

/**
 * Server action to generate documentation for a project using AI
 */
export async function generateDocumentation(
  input: GenerateDocumentationInput
): Promise<{
  success: boolean
  data?: ProjectDocumentation
  error?: string
}> {
  try {
    // Validate input
    const validatedInput = generateDocumentationInputSchema.parse(input)

    // System prompt to guide the AI
    const systemPrompt = `
      You are an expert software documentation generator for the heuristic platform.
      Your task is to analyze the provided repository files and generate comprehensive documentation.
      
      The documentation should include:
      1. An overview of the project
      2. Detailed sections about key components, architecture, and utilities
      3. Code quality analysis with complexity scores for each file
      4. Identification of technical debt (TODOs, FIXMEs, deprecated API usage)
      5. Refactoring suggestions with code examples
      6. Project statistics
      
      Your output MUST strictly follow the JSON schema provided and be valid JSON.
      Focus on providing actionable insights and clear explanations that would help developers understand the codebase.
      
      For code complexity, use these guidelines:
      - Low (0-30): Simple code with clear responsibilities
      - Medium (31-70): Moderate complexity with some state management or logic
      - High (71-100): Complex code with multiple responsibilities or complex logic
      
      For code quality grading:
      - A: Excellent code quality with minimal issues
      - B: Good code quality with some minor issues
      - C: Average code quality with several issues
      - D: Below average code quality with significant issues
      - F: Poor code quality with critical issues
      
      You can add +/- modifiers to grades (e.g., B+, C-)
      
      IMPORTANT: For previousGrade field, if there is no previous grade, use null (not the string "null").
      The grade format must be a single letter from A-F optionally followed by + or - (e.g., A+, B, C-).
    `

    // User prompt with repository information
    const userPrompt = `
      Generate comprehensive documentation for the following project:
      
      Project ID: ${validatedInput.projectId}
      Project Name: ${validatedInput.projectName}
      ${
        validatedInput.repositoryUrl
          ? `Repository URL: ${validatedInput.repositoryUrl}`
          : ''
      }
      ${
        validatedInput.language
          ? `Primary Language: ${validatedInput.language}`
          : ''
      }
      ${
        validatedInput.context?.description
          ? `Description: ${validatedInput.context.description}`
          : ''
      }
      
      The project contains ${validatedInput.files.length} files.
      
      Here are the files to analyze:
      ${validatedInput.files
        .map(
          file =>
            `
--- File: ${file.path} ---
${file.content.substring(0, 1000)}${
              file.content.length > 1000 ? '...(truncated)' : ''
            }`
        )
        .join('\n\n')}
      
      ${
        validatedInput.context?.dependencies
          ? `
Dependencies:
${Object.entries(validatedInput.context.dependencies)
  .map(([name, version]) => `- ${name}: ${version}`)
  .join('\n')}`
          : ''
      }
      
      IMPORTANT NOTES ON FORMAT:
      1. For the previousGrade field in codeQuality, if there is no previous grade, use null (not the string "null").
      2. All grade values must be a single letter from A-F optionally followed by + or - (e.g., A+, B, C-).
      3. Make sure all IDs are simple strings without special format requirements.
    `
    const { object } = await generateObject({
      model: google('gemini-2.0-flash'),
      schema: projectDocumentationSchema,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.2, // Lower temperature for more structured output
    })
    console.log('object from gemini: ', object)
    revalidatePath(`/dashboard/project/${validatedInput.projectId}`)
    return {
      success: true,
      data: object,
    }
  } catch (error) {
    console.error('Error generating documentation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
