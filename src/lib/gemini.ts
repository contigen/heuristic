import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { projectDocumentationSchema } from './schema'
import { ZodError } from 'zod'

export async function generateDocumentation() {
  const object = await generateObject({
    model: google('gemini-2.0-flash-exp'),
    system: '',
    schema: projectDocumentationSchema,
  })
  try {
    const response = projectDocumentationSchema.parse(object)
    return response
  } catch (err) {
    if (err instanceof ZodError) {
      console.error('parsing failed')
    }
    console.error('error: ', err)
  }
}
