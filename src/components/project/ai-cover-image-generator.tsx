'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download, RefreshCw, ImageIcon, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import type { ProjectDocumentation } from '@/lib/schema'
import { Skeleton } from '@/components/ui/skeleton'
import { generateAICoverImage } from '@/lib/ai-cover-image-service'
import { Badge } from '@/components/ui/badge'

interface AICoverImageGeneratorProps {
  documentation: ProjectDocumentation
  onImageGenerated?: (imageUrl: string) => void
  className?: string
}

export function AICoverImageGenerator({
  documentation,
  onImageGenerated,
  className = '',
}: AICoverImageGeneratorProps) {
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [colors, setColors] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [options, setOptions] = useState({
    style: 'modern',
    title: documentation.projectName,
    subtitle: documentation.repositoryUrl || 'Generated Documentation',
  })

  const generateImage = async () => {
    setIsGenerating(true)
    try {
      const result = await generateAICoverImage(documentation, options)

      setDescription(result.description)
      setColors(result.colors)
      setCoverImage(result.imagebase64Code)

      if (onImageGenerated) {
        onImageGenerated(result.imagebase64Code)
      }

      toast.success('AI cover image generated successfully')
    } catch (error) {
      console.error('Error generating AI cover image:', error)
      toast.error('Failed to generate AI cover image')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleOptionChange = (key: keyof typeof options, value: string) => {
    setOptions(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleDownload = () => {
    if (!coverImage) return

    const link = document.createElement('a')
    link.href = coverImage
    link.download = `${documentation.projectName || 'documentation'}-cover.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Cover image downloaded')
  }

  return (
    <Card className={`border-0 shadow-md ${className}`}>
      <CardHeader className='elegant-card-header'>
        <div className='flex items-center justify-between'>
          <CardTitle>AI Cover Image</CardTitle>
          <Badge variant='outline' className='gap-1'>
            <Sparkles className='h-3 w-3' />
            AI Generated
          </Badge>
        </div>
        <CardDescription>
          Generate a custom AI cover image for your documentation
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <Tabs defaultValue='preview' className='w-full'>
          <TabsList className='w-full justify-start px-4 pt-2'>
            <TabsTrigger value='preview'>Preview</TabsTrigger>
            <TabsTrigger value='customize'>Customize</TabsTrigger>
            <TabsTrigger value='info'>Info</TabsTrigger>
          </TabsList>

          <TabsContent value='preview' className='p-4 pt-2'>
            <div className='flex flex-col items-center'>
              {isGenerating ? (
                <Skeleton className='w-full aspect-[1.4/1] rounded-md' />
              ) : coverImage ? (
                <div className='border rounded-md overflow-hidden shadow-sm'>
                  <img
                    src={coverImage}
                    alt='Documentation Cover'
                    className='w-full h-auto'
                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <div className='flex items-center justify-center w-full aspect-[1.4/1] bg-muted rounded-md'>
                  <div className='text-center'>
                    <ImageIcon className='h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20' />
                    <p className='text-muted-foreground'>
                      No cover image generated yet
                    </p>
                  </div>
                </div>
              )}

              <div className='flex gap-2 mt-4'>
                <Button
                  variant='outline'
                  onClick={generateImage}
                  disabled={isGenerating}
                  className='gap-2'
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className='h-4 w-4 animate-spin' />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className='h-4 w-4' />
                      Regenerate
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={!coverImage || isGenerating}
                  className='gap-2'
                >
                  <Download className='h-4 w-4' />
                  Download
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='customize' className='p-4 pt-2'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='style'>Style</Label>
                <Select
                  value={options.style}
                  onValueChange={value => handleOptionChange('style', value)}
                >
                  <SelectTrigger id='style'>
                    <SelectValue placeholder='Select a style' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='modern'>Modern</SelectItem>
                    <SelectItem value='minimalist'>Minimalist</SelectItem>
                    <SelectItem value='abstract'>Abstract</SelectItem>
                    <SelectItem value='geometric'>Geometric</SelectItem>
                    <SelectItem value='tech'>Tech</SelectItem>
                    <SelectItem value='blueprint'>Blueprint</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='title'>Title</Label>
                <Input
                  id='title'
                  value={options.title || ''}
                  onChange={e => handleOptionChange('title', e.target.value)}
                  placeholder='Documentation Title'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='subtitle'>Subtitle</Label>
                <Input
                  id='subtitle'
                  value={options.subtitle || ''}
                  onChange={e => handleOptionChange('subtitle', e.target.value)}
                  placeholder='Documentation Subtitle'
                />
              </div>

              <Button
                onClick={generateImage}
                disabled={isGenerating}
                className='w-full gap-2 mt-4'
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className='h-4 w-4 animate-spin' />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className='h-4 w-4' />
                    Generate AI Cover Image
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value='info' className='p-4 pt-2'>
            {description ? (
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium'>About this cover</h3>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    {description}
                  </p>
                </div>

                {colors.length > 0 && (
                  <div>
                    <h3 className='text-sm font-medium'>Color palette</h3>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {colors.map((color, index) => (
                        <div key={index} className='flex flex-col items-center'>
                          <div
                            className='w-8 h-8 rounded-full border'
                            style={{ backgroundColor: color }}
                          />
                          <span className='text-xs mt-1'>{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className='text-xs text-muted-foreground mt-4'>
                  <p>
                    This cover image was generated using AI based on your
                    project documentation.
                  </p>
                </div>
              </div>
            ) : (
              <div className='text-center p-4 text-muted-foreground'>
                <p>Generate a cover image to see information about it.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
