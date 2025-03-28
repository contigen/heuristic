'use server'

import { z } from 'zod'
import { generateObject, generateText } from 'ai'
import type { ProjectDocumentation } from '@/lib/schema'
import { google } from '@ai-sdk/google'

const coverImageSchema = z.object({
  imagebase64Code: z.string().describe('The base64 code for the cover image'),
  description: z
    .string()
    .describe('A description of the generated cover image'),
  colors: z
    .array(z.string())
    .describe('The color palette used in the cover image'),
})

export type AICoverImage = z.infer<typeof coverImageSchema>

export async function generateAICoverImage(
  documentation: ProjectDocumentation,
  options: {
    style?: string
    title?: string
    subtitle?: string
  } = {}
): Promise<AICoverImage> {
  const title = options.title || documentation.projectName
  const subtitle =
    options.subtitle || documentation.repositoryUrl || 'Generated Documentation'
  const style = options.style || 'modern'

  const keyFeatures =
    documentation.sections?.find(
      section =>
        section.title.toLowerCase().includes('feature') ||
        section.title.toLowerCase().includes('key')
    )?.content || ''

  const architecture =
    documentation.sections?.find(section =>
      section.title.toLowerCase().includes('architecture')
    )?.content || ''

  try {
    const { files } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      providerOptions: {
        google: { responseModalities: ['TEXT', 'IMAGE'] },
      },
      prompt: `
        Create a visually appealing cover image for a software documentation PDF.
        
        Project: ${title}
        Subtitle: ${subtitle}
        Style: ${style}
        
        Key information about the project:
        ${documentation.overview}
        
        ${keyFeatures ? `Key features: ${keyFeatures}` : ''}
        ${architecture ? `Architecture: ${architecture}` : ''}
        
        The cover image shouldrepresent the project's purpose and technology.
        Use a color scheme that is professional and matches the ${style} style.
        Include the title and subtitle in the design.
        The SVG should be optimized for a PDF cover page (A4 size, portrait orientation).
        Make it visually interesting with abstract patterns or illustrations related to the project domain.
        Do not include any placeholder text or images.
      `,
    })

    const image = files[0]

    const { object } = await generateObject({
      model: google('gemini-2.0-flash'),
      schema: coverImageSchema.omit({ imagebase64Code: true }),
      //   prompt:
      //     'gimme an apt description of this image, and the colours used in it, from the scenery, to the foreground, and whatnots',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'gimme an apt description of this image, and the colours used in it, from the scenery, to the foreground, and whatnots',
            },
            {
              type: 'image',
              image: image.base64,
              mimeType: image.mimeType,
            },
          ],
        },
      ],
    })
    console.log('object received from gemini: ', object)
    return {
      imagebase64Code: `data:${image.mimeType};base64,${image.base64}`,
      description: object.description,
      colors: object.colors,
    }
  } catch (error) {
    console.error('Error generating AI cover image:', error)
    throw new Error('Failed to generate AI cover image')
  }
}
