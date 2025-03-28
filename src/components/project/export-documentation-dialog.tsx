import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { RefreshCw, Download } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { AICoverImageGenerator } from '@/components/project/ai-cover-image-generator'
import { ProjectDocumentation } from '@/lib/schema'
import { exportDocumentation } from '@/export-documentation'
import { toast } from 'sonner'
import { downloadFile } from '@/lib/utils'
import { Dispatch, SetStateAction, useState } from 'react'

export function ExportDocumentationDialog({
  documentation,
  showExportDialog,
  setShowExportDialog,
}: {
  documentation: ProjectDocumentation
  showExportDialog: boolean
  setShowExportDialog: Dispatch<SetStateAction<boolean>>
}) {
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [exportFormat, setExportFormat] = useState('markdown')
  const [isExporting, setIsExporting] = useState(false)
  const [includeSections, setIncludeSections] = useState({
    overview: true,
    components: true,
    utilities: true,
    codeExamples: true,
    aiNotes: true,
  })

  const handleExportDocumentation = async (coverImageUrl?: string) => {
    setIsExporting(true)

    try {
      // Get the documentation from the store
      if (!documentation) {
        toast.error('No documentation available to export')
        setIsExporting(false)
        setShowExportDialog(false)
        return
      }

      // Call the server action to export the documentation
      const result = await exportDocumentation({
        documentation,
        format: exportFormat as 'markdown' | 'json' | 'html' | 'pdf',
        includeSections,
        coverImageUrl, // Add this line
      })

      if (result.success && result.data) {
        // Download the file
        downloadFile(
          result.data.content.toString(),
          result.data.filename,
          result.data.contentType
        )

        toast.success(`Documentation Exported`, {
          description: `Documentation has been exported as ${exportFormat.toUpperCase()}.`,
        })
      } else {
        toast.error('Export failed', {
          description: result.error || 'An error occurred during export',
        })
      }
    } catch (error) {
      console.error('Error exporting documentation:', error)
      toast.error('Export failed', {
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsExporting(false)
      setShowExportDialog(false)
    }
  }

  const handleSectionChange = (section: string, checked: boolean) => {
    setIncludeSections(prev => ({
      ...prev,
      [section]: checked,
    }))
  }

  return (
    <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Export Documentation</DialogTitle>
          <DialogDescription>
            Choose your preferred format and options for exporting the
            documentation.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='options' className='w-full'>
          <TabsList className='w-full'>
            <TabsTrigger value='options'>Export Options</TabsTrigger>
            <TabsTrigger value='cover'>Cover Image</TabsTrigger>
          </TabsList>

          <TabsContent value='options' className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='format'>Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id='format'>
                  <SelectValue placeholder='Select format' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='markdown'>Markdown (.md)</SelectItem>
                  <SelectItem value='pdf'>PDF Document (.pdf)</SelectItem>
                  <SelectItem value='html'>HTML (.html)</SelectItem>
                  <SelectItem value='json'>JSON (.json)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-4 mt-2'>
              <Label>Include Sections</Label>
              <div className='grid grid-cols-2 gap-2'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='overview'
                    checked={includeSections.overview}
                    onCheckedChange={checked =>
                      handleSectionChange('overview', checked as boolean)
                    }
                  />
                  <Label htmlFor='overview'>Overview</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='components'
                    checked={includeSections.components}
                    onCheckedChange={checked =>
                      handleSectionChange('components', checked as boolean)
                    }
                  />
                  <Label htmlFor='components'>Components</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='utilities'
                    checked={includeSections.utilities}
                    onCheckedChange={checked =>
                      handleSectionChange('utilities', checked as boolean)
                    }
                  />
                  <Label htmlFor='utilities'>Utilities</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='code-examples'
                    checked={includeSections.codeExamples}
                    onCheckedChange={checked =>
                      handleSectionChange('codeExamples', checked as boolean)
                    }
                  />
                  <Label htmlFor='code-examples'>Code Examples</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='ai-notes'
                    checked={includeSections.aiNotes}
                    onCheckedChange={checked =>
                      handleSectionChange('aiNotes', checked as boolean)
                    }
                  />
                  <Label htmlFor='ai-notes'>AI Notes</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='cover' className='py-4'>
            {documentation ? (
              <AICoverImageGenerator
                documentation={documentation}
                onImageGenerated={setCoverImageUrl}
              />
            ) : (
              <div className='text-center p-6 text-muted-foreground'>
                <p>No documentation available to generate a cover image.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant='outline' onClick={() => setShowExportDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleExportDocumentation(coverImageUrl || undefined)
            }
            disabled={isExporting}
            className='gap-2'
          >
            {isExporting ? (
              <>
                <RefreshCw className='h-4 w-4 animate-spin' />
                Exporting...
              </>
            ) : (
              <>
                <Download className='h-4 w-4' />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
