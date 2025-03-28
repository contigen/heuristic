import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Save } from 'lucide-react'
import { auth } from '@/auth'

export default async function SettingsPage() {
  const session = await auth()
  const {
    githubUserName,
    user: { name, email },
  } = session!
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>Settings</h2>
        <Button className='gap-2'>
          <Save className='w-4 h-4' />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue='general' className='space-y-6'>
        <TabsList>
          <TabsTrigger value='general'>General</TabsTrigger>
          <TabsTrigger value='api-keys'>API Keys</TabsTrigger>
          <TabsTrigger value='ai-preferences'>AI Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value='general' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <fieldset disabled className='space-y-6'>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Name</Label>
                      <Input id='name' defaultValue={name?.toString()} />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        type='email'
                        defaultValue={email?.toString()}
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='username'>Github Username</Label>
                    <Input id='username' defaultValue={githubUserName} />
                  </div>
                </fieldset>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='api-keys' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for external services
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='github-token'>
                    GitHub Personal Access Token
                  </Label>
                  <div className='flex gap-2'>
                    <Input
                      id='github-token'
                      type='password'
                      defaultValue='ghp_1234567890abcdefghijklmnopqrstuvwxyz'
                    />
                    <Button variant='outline'>Revoke</Button>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Used to access your GitHub repositories
                  </p>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <Label htmlFor='azure-key'>Azure OpenAI API Key</Label>
                  <div className='flex gap-2'>
                    <Input
                      id='azure-key'
                      placeholder='Enter your Azure OpenAI API key'
                    />
                    <Button variant='outline'>Add</Button>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Optional: Use Azure OpenAI instead of OpenAI
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='ai-preferences' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>AI Preferences</CardTitle>
              <CardDescription>
                Customize how AI generates documentation and insights
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='ai-model'>AI Model</Label>
                  <Select defaultValue='gpt-4'>
                    <SelectTrigger id='ai-model'>
                      <SelectValue placeholder='Select an AI model' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='gpt-4'>GPT-4</SelectItem>
                      <SelectItem value='gpt-3.5-turbo'>
                        GPT-3.5 Turbo
                      </SelectItem>
                      <SelectItem value='azure-gpt-4'>Azure GPT-4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <Label htmlFor='detail-level'>
                    Documentation Detail Level
                  </Label>
                  <Select defaultValue='medium'>
                    <SelectTrigger id='detail-level'>
                      <SelectValue placeholder='Select detail level' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='low'>Low (Brief overview)</SelectItem>
                      <SelectItem value='medium'>Medium (Balanced)</SelectItem>
                      <SelectItem value='high'>High (Comprehensive)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className='space-y-4'>
                  <Label>Documentation Sections</Label>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    {[
                      { id: 'overview', label: 'Overview' },
                      { id: 'api-docs', label: 'API Documentation' },
                      { id: 'examples', label: 'Code Examples' },
                      { id: 'architecture', label: 'Architecture' },
                      { id: 'dependencies', label: 'Dependencies' },
                      { id: 'testing', label: 'Testing' },
                    ].map(section => (
                      <div
                        key={section.id}
                        className='flex items-center space-x-2'
                      >
                        <Switch
                          id={section.id}
                          defaultChecked={section.id !== 'testing'}
                        />
                        <Label htmlFor={section.id}>{section.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className='space-y-4'>
                  <Label>AI Insights</Label>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    {[
                      { id: 'complexity', label: 'Code Complexity Analysis' },
                      { id: 'refactoring', label: 'Refactoring Suggestions' },
                      { id: 'security', label: 'Security Analysis' },
                      { id: 'performance', label: 'Performance Optimization' },
                      { id: 'best-practices', label: 'Best Practices' },
                      { id: 'pr-analysis', label: 'Pull Request Analysis' },
                    ].map(insight => (
                      <div
                        key={insight.id}
                        className='flex items-center space-x-2'
                      >
                        <Switch
                          id={insight.id}
                          defaultChecked={insight.id !== 'security'}
                        />
                        <Label htmlFor={insight.id}>{insight.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
