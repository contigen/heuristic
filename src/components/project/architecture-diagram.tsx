'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { MermaidDiagram } from '@lightenna/react-mermaid-diagram'

interface ArchitectureDiagramProps {
  projectId: string
  mermaidCode: string
  metadata?: {
    nodeCount?: number
    edgeCount?: number
    diagramType?: string
    direction?: string
  }
  description?: string
  title?: string
  className?: string
}

export function ArchitectureDiagram({
  mermaidCode,
  metadata,
  description,
  title = 'Architecture Diagram',
}: ArchitectureDiagramProps) {
  return (
    <Card className='h-full border-0 shadow-md elegant-card'>
      <CardHeader className='elegant-card-header'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              Visual representation of project architecture{' '}
            </CardDescription>
          </div>
        </div>

        {metadata && (
          <div className='mt-2 p-3 bg-muted/30 rounded-md'>
            <div className='flex flex-wrap gap-2 mb-2'>
              {metadata.nodeCount && (
                <Badge variant='outline'>{metadata.nodeCount} Nodes</Badge>
              )}
              {metadata.edgeCount && (
                <Badge variant='outline'>
                  {metadata.edgeCount} Connections
                </Badge>
              )}
              {metadata.diagramType && (
                <Badge variant='outline'>Type: {metadata.diagramType}</Badge>
              )}
              {metadata.direction && (
                <Badge variant='outline'>Direction: {metadata.direction}</Badge>
              )}
            </div>
            {description && (
              <p className='text-sm text-muted-foreground'>🧜‍♀️ {description}</p>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className='p-4'>
        <MermaidDiagram>{mermaidCode}</MermaidDiagram>
      </CardContent>
    </Card>
  )
}
