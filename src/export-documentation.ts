'use server'

import {
  projectDocumentationSchema,
  type ProjectDocumentation,
} from '@/lib/schema'
import { z } from 'zod'
import { marked } from 'marked'
import { jsPDF } from 'jspdf'

const exportDocumentationInputSchema = z.object({
  documentation: projectDocumentationSchema,
  format: z.enum(['markdown', 'json', 'html', 'pdf']),
  includeSections: z
    .object({
      overview: z.boolean().default(true),
      components: z.boolean().default(true),
      utilities: z.boolean().default(true),
      codeExamples: z.boolean().default(true),
      aiNotes: z.boolean().default(true),
    })
    .default({
      overview: true,
      components: true,
      utilities: true,
      codeExamples: true,
      aiNotes: true,
    }),
  coverImageUrl: z.string().optional(),
})

type ExportDocumentationInput = z.infer<typeof exportDocumentationInputSchema>

export async function exportDocumentation(
  input: ExportDocumentationInput
): Promise<{
  success: boolean
  data?: {
    content: string
    filename: string
    contentType: string
  }
  error?: string
}> {
  try {
    const validatedInput = exportDocumentationInputSchema.parse(input)
    const { documentation, format, includeSections, coverImageUrl } =
      validatedInput

    if (!documentation || !documentation.projectName) {
      throw new Error('Invalid documentation data')
    }

    const safeProjectName = documentation.projectName
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `${safeProjectName}_documentation_${timestamp}`

    switch (format) {
      case 'markdown':
        return {
          success: true,
          data: {
            content: generateMarkdown(documentation, includeSections),
            filename: `${filename}.md`,
            contentType: 'text/markdown',
          },
        }
      case 'json':
        return {
          success: true,
          data: {
            content: generateJSON(documentation, includeSections),
            filename: `${filename}.json`,
            contentType: 'application/json',
          },
        }
      case 'html':
        return {
          success: true,
          data: {
            content: generateHTML(documentation, includeSections),
            filename: `${filename}.html`,
            contentType: 'text/html',
          },
        }
      case 'pdf':
        return {
          success: true,
          data: {
            content: generatePDF(documentation, includeSections, coverImageUrl), // Pass coverImageUrl
            filename: `${filename}.pdf`,
            contentType: 'application/pdf',
          },
        }
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  } catch (error) {
    console.error('Error exporting documentation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

function generateMarkdown(
  documentation: ProjectDocumentation,
  includeSections: ExportDocumentationInput['includeSections']
): string {
  let markdown = `# ${documentation.projectName} Documentation\n\n`

  markdown += `- **Repository**: ${documentation.repositoryUrl || 'N/A'}\n`
  markdown += `- **Language**: ${documentation.language || 'N/A'}\n`
  markdown += `- **Last Analyzed**: ${new Date(
    documentation.lastAnalyzed || Date.now()
  ).toLocaleDateString()}\n\n`

  if (includeSections.overview) {
    markdown += `## Overview\n\n${documentation.overview}\n\n`
  }

  if (includeSections.components || includeSections.utilities) {
    documentation.sections.forEach(section => {
      if (
        !includeSections.components &&
        section.title.toLowerCase().includes('component')
      )
        return
      if (
        !includeSections.utilities &&
        section.title.toLowerCase().includes('utilit')
      )
        return

      markdown += `## ${section.title}\n\n${section.content}\n\n`

      if (
        includeSections.codeExamples &&
        section.codeExamples &&
        section.codeExamples.length > 0
      ) {
        section.codeExamples.forEach(example => {
          markdown += `\`\`\`${example.language}\n${example.code}\n\`\`\`\n\n`
        })
      }
    })
  }

  if (
    includeSections.aiNotes &&
    documentation.aiNotes &&
    documentation.aiNotes.length > 0
  ) {
    markdown += `## AI Notes\n\n`
    documentation.aiNotes.forEach(note => {
      markdown += `### ${note.title || 'Note'}\n\n`
      markdown += `${note.content}\n\n`
      if (note.relatedFiles && note.relatedFiles.length > 0) {
        markdown += `Related files: ${note.relatedFiles.join(', ')}\n\n`
      }
    })
  }

  markdown += `## Code Quality\n\n`
  markdown += `- **Score**: ${documentation.codeQuality.score}/100\n`
  markdown += `- **Grade**: ${documentation.codeQuality.grade}\n`
  if (documentation.codeQuality.previousGrade) {
    markdown += `- **Previous Grade**: ${documentation.codeQuality.previousGrade}\n`
  }
  markdown += `\n`

  if (documentation.suggestions && documentation.suggestions.length > 0) {
    markdown += `## Refactoring Suggestions\n\n`
    documentation.suggestions.forEach(suggestion => {
      markdown += `### ${suggestion.title}\n\n`
      markdown += `**Priority**: ${suggestion.priority}\n\n`
      markdown += `**File**: ${suggestion.file}${
        suggestion.lineNumber ? `:${suggestion.lineNumber}` : ''
      }\n\n`
      markdown += `${suggestion.description}\n\n`
      if (suggestion.suggestedCode) {
        markdown += `Suggested code:\n\n\`\`\`${suggestion.suggestedCode.language}\n${suggestion.suggestedCode.code}\n\`\`\`\n\n`
      }
    })
  }

  return markdown
}

function generateJSON(
  documentation: ProjectDocumentation,
  includeSections: ExportDocumentationInput['includeSections']
): string {
  const filteredDoc = { ...documentation }

  if (!includeSections.overview) {
    filteredDoc.overview = '[Excluded from export]'
  }

  if (!includeSections.components || !includeSections.utilities) {
    filteredDoc.sections = documentation.sections.filter(section => {
      if (
        !includeSections.components &&
        section.title.toLowerCase().includes('component')
      )
        return false
      if (
        !includeSections.utilities &&
        section.title.toLowerCase().includes('utilit')
      )
        return false
      return true
    })
  }

  if (!includeSections.codeExamples) {
    filteredDoc.sections = filteredDoc.sections.map((section: any) => ({
      ...section,
      codeExamples: section.codeExamples
        ? ['[Code examples excluded from export]']
        : [],
    }))
  }

  if (!includeSections.aiNotes) {
    filteredDoc.aiNotes = []
  }

  return JSON.stringify(filteredDoc, null, 2)
}

function generateHTML(
  documentation: ProjectDocumentation,
  includeSections: ExportDocumentationInput['includeSections']
): string {
  const markdown = generateMarkdown(documentation, includeSections)
  const htmlContent = marked(markdown)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentation.projectName} Documentation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    pre {
      background-color: #f6f8fa;
      border-radius: 3px;
      padding: 16px;
      overflow: auto;
    }
    code {
      font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 85%;
    }
    h1, h2, h3 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 {
      padding-bottom: 0.3em;
      font-size: 2em;
      border-bottom: 1px solid #eaecef;
    }
    h2 {
      padding-bottom: 0.3em;
      font-size: 1.5em;
      border-bottom: 1px solid #eaecef;
    }
    h3 {
      font-size: 1.25em;
    }
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      margin-right: 10px;
      width: 1.5rem;
      height: 1.5rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
      padding: .5rem;
      border-radius: .5rem;
      background-color: #1E4DFF;
    }
    .metadata {
      margin-bottom: 20px;
      padding-block: 10px;
      padding-inline: 20px;
      background-color: #f6f8fa;
      border-radius: .5rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">h</div>
    <h1>heuristic</h1>
  </div>
  <div class="metadata">
    <p><strong>Project:</strong> ${documentation.projectName}</p>
    <p><strong>Repository:</strong> ${documentation.repositoryUrl || 'N/A'}</p>
    <p><strong>Language:</strong> ${documentation.language || 'N/A'}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
  </div>
  ${htmlContent}
</body>
</html>`
}

function generatePDF(
  documentation: ProjectDocumentation,
  includeSections: ExportDocumentationInput['includeSections'],
  coverImageUrl?: string
): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  const addText = (
    text: string,
    fontSize: number,
    isBold = false,
    isItalic = false
  ) => {
    doc.setFontSize(fontSize)

    if (isBold && isItalic) doc.setFont('helvetica', 'bolditalic')
    else if (isBold) doc.setFont('helvetica', 'bold')
    else if (isItalic) doc.setFont('helvetica', 'italic')
    else doc.setFont('helvetica', 'normal')

    const textLines = doc.splitTextToSize(text, contentWidth)

    if (
      y + textLines.length * fontSize * 0.35 >
      doc.internal.pageSize.getHeight() - margin
    ) {
      doc.addPage()
      y = margin
    }

    doc.text(textLines, margin, y)
    y += textLines.length * fontSize * 0.35 + 5
  }

  const addLine = () => {
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(margin, y, pageWidth - margin, y)
    y += 5
  }

  const addSpace = (space: number) => {
    y += space
  }

  if (coverImageUrl) {
    try {
      const imageData = coverImageUrl.split(',')[1]
      if (imageData) {
        doc.addPage()
        doc.setPage(1)
        doc.addImage({
          imageData,
          x: 0,
          y: 0,
          width: pageWidth,
          height: doc.internal.pageSize.getHeight(),
          compression: 'FAST',
        })

        doc.addPage()
        y = margin
      }
    } catch (error) {
      console.error('Error adding cover image to PDF:', error)
    }
  }

  doc.setFillColor(41, 98, 255)
  doc.rect(0, 0, pageWidth, 15, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('heuristic', margin, 10)
  doc.setFont('helvetica', 'normal')
  doc.text('AI-Powered Documentation', 50, 10)
  doc.setTextColor(0, 0, 0)

  y += 10
  addText(`${documentation.projectName} Documentation`, 24, true)
  addSpace(5)

  addText(`Repository: ${documentation.repositoryUrl || 'N/A'}`, 10)
  addText(`Language: ${documentation.language || 'N/A'}`, 10)
  addText(
    `Last Analyzed: ${new Date(
      documentation.lastAnalyzed || Date.now()
    ).toLocaleDateString()}`,
    10
  )
  addText(`Generated: ${new Date().toLocaleDateString()}`, 10)

  addSpace(5)
  addLine()
  addSpace(5)

  if (includeSections.overview) {
    addText('Overview', 16, true)
    addSpace(3)
    addText(documentation.overview, 11)
    addSpace(5)
    addLine()
    addSpace(5)
  }

  if (includeSections.components || includeSections.utilities) {
    documentation.sections.forEach(section => {
      if (
        !includeSections.components &&
        section.title.toLowerCase().includes('component')
      )
        return
      if (
        !includeSections.utilities &&
        section.title.toLowerCase().includes('utilit')
      )
        return

      addText(section.title, 16, true)
      addSpace(3)
      addText(section.content, 11)

      if (
        includeSections.codeExamples &&
        section.codeExamples &&
        section.codeExamples.length > 0
      ) {
        section.codeExamples.forEach(example => {
          addSpace(5)
          doc.setFillColor(245, 245, 245)
          const codeY = y
          const codeHeight = example.code.split('\n').length * 5 + 10
          doc.rect(margin, codeY, contentWidth, codeHeight, 'F')

          y += 5
          doc.setFont('courier', 'normal')
          doc.setFontSize(8)
          const codeLines = example.code.split('\n')
          codeLines.forEach(line => {
            if (y > doc.internal.pageSize.getHeight() - margin) {
              doc.addPage()
              y = margin
              doc.setFillColor(245, 245, 245)
              doc.rect(
                margin,
                y,
                contentWidth,
                (codeLines.length - codeLines.indexOf(line)) * 5 + 5,
                'F'
              )
              y += 5
            }
            doc.text(line, margin + 5, y)
            y += 5
          })
          doc.setFont('helvetica', 'normal')
          y += 5
        })
      }

      addSpace(5)
      addLine()
      addSpace(5)
    })
  }

  if (
    includeSections.aiNotes &&
    documentation.aiNotes &&
    documentation.aiNotes.length > 0
  ) {
    addText('AI Notes', 16, true)
    addSpace(5)

    documentation.aiNotes.forEach(note => {
      addText(note.title || 'Note', 14, true)
      addSpace(3)
      addText(note.content, 11)

      if (note.relatedFiles && note.relatedFiles.length > 0) {
        addSpace(3)
        addText(
          `Related files: ${note.relatedFiles.join(', ')}`,
          10,
          false,
          true
        )
      }

      addSpace(5)
    })

    addLine()
    addSpace(5)
  }

  addText('Code Quality', 16, true)
  addSpace(3)
  addText(`Score: ${documentation.codeQuality.score}/100`, 11)
  addText(`Grade: ${documentation.codeQuality.grade}`, 11)

  if (documentation.codeQuality.previousGrade) {
    addText(`Previous Grade: ${documentation.codeQuality.previousGrade}`, 11)
  }

  addSpace(5)
  addLine()
  addSpace(5)

  if (documentation.suggestions && documentation.suggestions.length > 0) {
    addText('Refactoring Suggestions', 16, true)
    addSpace(5)

    documentation.suggestions.forEach(suggestion => {
      addText(suggestion.title, 14, true)
      addSpace(2)

      doc.setTextColor(
        suggestion.priority === 'high'
          ? 220
          : suggestion.priority === 'medium'
          ? 200
          : 50,
        suggestion.priority === 'high'
          ? 50
          : suggestion.priority === 'medium'
          ? 150
          : 200,
        50
      )
      addText(`Priority: ${suggestion.priority}`, 11, true)
      doc.setTextColor(0, 0, 0)

      addSpace(2)
      addText(
        `File: ${suggestion.file}${
          suggestion.lineNumber ? `:${suggestion.lineNumber}` : ''
        }`,
        11
      )
      addSpace(2)
      addText(suggestion.description, 11)

      if (suggestion.suggestedCode) {
        addSpace(3)
        addText('Suggested code:', 11, true)

        addSpace(2)
        doc.setFillColor(245, 245, 245)
        const codeY = y
        const codeHeight =
          suggestion.suggestedCode.code.split('\n').length * 5 + 10
        doc.rect(margin, codeY, contentWidth, codeHeight, 'F')

        y += 5
        doc.setFont('courier', 'normal')
        doc.setFontSize(8)
        const codeLines = suggestion.suggestedCode.code.split('\n')
        codeLines.forEach(line => {
          if (y > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage()
            y = margin
            doc.setFillColor(245, 245, 245)
            doc.rect(
              margin,
              y,
              contentWidth,
              (codeLines.length - codeLines.indexOf(line)) * 5 + 5,
              'F'
            )
            y += 5
          }

          doc.text(line, margin + 5, y)
          y += 5
        })
        doc.setFont('helvetica', 'normal')
      }

      addSpace(8)
    })
  }

  const totalPages = doc.internal.pages.length
  for (let i = 1; i < totalPages; i++) {
    doc.setPage(i)

    if (coverImageUrl && i === 1) continue

    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Generated by heuristic - Page ${i - (coverImageUrl ? 1 : 0)} of ${
        totalPages - (coverImageUrl ? 2 : 1)
      }`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  const pdfBase64 = doc.output('datauristring')

  return pdfBase64.split(',')[1]
}
