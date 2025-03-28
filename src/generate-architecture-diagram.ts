'use server'

import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

// Define a schema for the Mermaid diagram
const mermaidDiagramSchema = z.object({
  // The actual Mermaid code
  code: z.string(),
  // Metadata about the diagram
  metadata: z.object({
    nodeCount: z.number(),
    edgeCount: z.number(),
    diagramType: z
      .enum([
        'flowchart',
        'classDiagram',
        'sequenceDiagram',
        'entityRelationship',
      ])
      .default('flowchart'),
    direction: z.enum(['TD', 'LR', 'RL', 'BT']).default('TD'),
  }),
  // Description of what the diagram shows
  description: z.string(),
})

export type MermaidDiagram = z.infer<typeof mermaidDiagramSchema>

export async function generateArchitectureDiagram(
  projectFiles: { path: string; content?: string }[]
) {
  try {
    // Create a simplified representation of the project structure
    const fileStructure = projectFiles.map(file => ({
      path: file.path,
      // Include a snippet of content if available (first 500 chars)
      snippet: file.content
        ? file.content.substring(0, 500) +
          (file.content.length > 500 ? '...' : '')
        : undefined,
    }))

    // Create a prompt for the AI to generate a Mermaid diagram
    const prompt = `
      Based on the following project structure, generate a Mermaid diagram that visualizes the architecture.
      
      Project files:
      ${JSON.stringify(fileStructure, null, 2)}
      
      Create a Mermaid diagram that shows:
      1. The main components and their relationships
      2. Data flow between components
      3. Key dependencies and interfaces
      
      Group related files into subgraphs by directory.
      Use appropriate styling to distinguish different types of files.
      Make sure connections between nodes accurately represent dependencies.
      
      The diagram should be clear, well-organized, and follow Mermaid best practices.
    `

    // Generate the Mermaid diagram using AI with the schema
    const { object } = await generateObject({
      model: google('gemini-2.0-flash'),
      prompt,
      schema: mermaidDiagramSchema,
      temperature: 0.2, // Lower temperature for more consistent output
    })
    console.log('mermaid text: ', object)
    return {
      success: true,
      mermaidCode: object.code,
      metadata: object.metadata,
      description: object.description,
    }
  } catch (error) {
    console.error('Error generating architecture diagram:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      // Provide a fallback simple diagram
      mermaidCode: `
        graph TD;
          A["Components"] --> B["Hooks"];
          A --> C["Utils"];
          B --> D["API"];
          C --> D;
          D --> E["External Services"];
          
          classDef component fill:#e6f7ff,stroke:#1890ff;
          classDef hook fill:#f6ffed,stroke:#52c41a;
          classDef util fill:#fff7e6,stroke:#fa8c16;
          classDef api fill:#fff2f0,stroke:#ff4d4f;
          classDef service fill:#f9f0ff,stroke:#722ed1;
          
          class A component;
          class B hook;
          class C util;
          class D api;
          class E service;
      `,
    }
  }
}
