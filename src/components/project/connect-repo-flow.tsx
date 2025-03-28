'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Github,
  Search,
  RefreshCw,
  ArrowRight,
  Check,
  ChevronRight,
  Loader2,
  FolderGit2,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useGenerateDocumentation } from '@/use-generate-documentation'
import { Progress } from '@/components/ui/progress'
import { getUserReposAction, getRepoContentsAction } from '@/actions' // Import the server action

type Repository = {
  id: string
  name: string
  fullName: string
  description: string | null
  language: string | null
  stars: number
  updatedAt: string
  isPrivate: boolean
}

type Step = 'select' | 'configure' | 'analyzing' | 'documenting' | 'complete'

export function ConnectRepositoryFlow({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [step, setStep] = useState<Step>('select')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [scanDepth, setScanDepth] = useState('standard')
  const [autoSync, setAutoSync] = useState(true)
  const [includeBranches, setIncludeBranches] = useState(['main'])
  const [excludePatterns, setExcludePatterns] = useState(
    'node_modules/,dist/,.git/'
  )
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [documentationProgress, setDocumentationProgress] = useState(0)
  const router = useRouter()
  const { generateProjectDocumentation, isGenerating } =
    useGenerateDocumentation()

  // Fetch repositories when the dialog opens
  useEffect(() => {
    if (open) {
      fetchRepositories()
    }
  }, [open])

  // Function to fetch repositories using the server action
  const fetchRepositories = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const repos = await getUserReposAction()
      setRepositories(repos)
    } catch (err) {
      console.error('Error fetching repositories:', err)
      setError('Failed to fetch repositories. Please try again.')
      toast.error('Failed to fetch repositories. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRepos = searchQuery
    ? repositories.filter(
        repo =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (repo.description &&
            repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : repositories

  const handleSearch = () => {
    // No need to refetch, just filter the existing repositories
    // But we could implement a more advanced search that hits the GitHub API
  }

  const handleSelectRepo = (repo: Repository) => {
    setSelectedRepo(repo)
    setStep('configure')
  }

  const handleStartAnalysis = async () => {
    setStep('analyzing')

    // Start analysis progress animation
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
      }
      setAnalysisProgress(Math.min(Math.round(progress), 100))
    }, 800)

    try {
      if (selectedRepo) {
        // Once analysis is complete, move to documentation step
        setTimeout(() => {
          setStep('documenting')
          generateDocumentation()
        }, 500)
      }
    } catch (error) {
      toast.error('An error occurred during repository analysis')
      clearInterval(interval)
      setAnalysisProgress(100)
      setTimeout(() => {
        setStep('configure')
      }, 500)
    }
  }

  // Update the generateDocumentation function
  const generateDocumentation = async () => {
    if (!selectedRepo) return

    // Simulate fetching repository files
    let files = []

    try {
      // Extract owner and repo from the full name
      const [owner, repo] = selectedRepo.fullName.split('/')

      // Fetch actual repository files
      const repoContents = await getRepoContentsAction(owner, repo)

      // Map to the format expected by generateProjectDocumentation
      files = repoContents.map(file => ({
        path: file.path,
        content: file.content,
        language: getLanguageFromPath(file.path),
      }))

      toast.info('Fetched repository files', {
        description: `Found ${files.length} files in ${selectedRepo.fullName}`,
      })
    } catch (error) {
      console.error('Error fetching repository contents:', error)
      toast.error('Failed to fetch repository contents', {
        description: 'Using mock data instead.',
      })

      // Fall back to mock data
      files = mockFiles
    }

    // Show documentation generation progress
    let docProgress = 0
    const docInterval = setInterval(() => {
      docProgress += Math.random() * 8
      if (docProgress >= 100) {
        docProgress = 100
        clearInterval(docInterval)

        // Actually generate documentation using our server action
        generateProjectDocumentation(
          String(selectedRepo.id), // Ensure ID is a string
          selectedRepo.name,
          files,
          {
            repositoryUrl: `https://github.com/${selectedRepo.fullName}`,
            language: selectedRepo.language,
            description: selectedRepo.description || undefined,
            dependencies: {
              react: '^18.2.0',
              next: '^14.0.0',
              typescript: '^5.0.0',
            },
          }
        )
          .then(() => {
            setTimeout(() => {
              setStep('complete')
            }, 500)
          })
          .catch(err => {
            console.error('Error generating documentation:', err)
            toast.error('Failed to generate documentation', {
              description: 'Please try again.',
            })
            // Even if there's an error, move to complete step
            setStep('complete')
          })
      }
      setDocumentationProgress(Math.min(Math.round(docProgress), 100))
    }, 600)
  }

  // Helper function to determine language from file path
  const getLanguageFromPath = (path: string): string | null => {
    const extension = path.split('.').pop()?.toLowerCase()

    const languageMap: Record<string, string> = {
      js: 'JavaScript',
      jsx: 'JavaScript',
      ts: 'TypeScript',
      tsx: 'TypeScript',
      py: 'Python',
      rb: 'Ruby',
      java: 'Java',
      go: 'Go',
      php: 'PHP',
      cs: 'C#',
      cpp: 'C++',
      c: 'C',
      html: 'HTML',
      css: 'CSS',
      scss: 'SCSS',
      md: 'Markdown',
      json: 'JSON',
      yml: 'YAML',
      yaml: 'YAML',
    }

    return extension ? languageMap[extension] || null : null
  }

  // Helper function to determine file language
  const getFileLanguage = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase()

    const languageMap: Record<string, string> = {
      ts: 'TypeScript',
      tsx: 'TypeScript',
      js: 'JavaScript',
      jsx: 'JavaScript',
      py: 'Python',
      rb: 'Ruby',
      java: 'Java',
      go: 'Go',
      php: 'PHP',
      cs: 'C#',
      cpp: 'C++',
      c: 'C',
      html: 'HTML',
      css: 'CSS',
      scss: 'SCSS',
      md: 'Markdown',
      json: 'JSON',
      yml: 'YAML',
      yaml: 'YAML',
    }

    return extension ? languageMap[extension] || null : null
  }

  const handleComplete = () => {
    onOpenChange(false)

    // Navigate to the project page
    if (selectedRepo) {
      router.push(`/dashboard/project/${selectedRepo.id}`)
    }

    // Reset state after animation completes
    setTimeout(() => {
      setStep('select')
      setSelectedRepo(null)
      setAnalysisProgress(0)
      setDocumentationProgress(0)
    }, 300)

    toast.success(
      `${selectedRepo?.fullName} has been added to your projects.`,
      {
        description: 'Repository connected successfully',
      }
    )
  }

  const handleCancel = () => {
    onOpenChange(false)
    // Reset state after animation completes
    setTimeout(() => {
      setStep('select')
      setSelectedRepo(null)
      setAnalysisProgress(0)
      setDocumentationProgress(0)
    }, 300)
  }

  const getLanguageColor = (language: string | null) => {
    if (!language) return 'bg-gray-500'

    switch (language) {
      case 'TypeScript':
        return 'bg-blue-500'
      case 'JavaScript':
        return 'bg-yellow-500'
      case 'Python':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Format the date to a relative time (e.g., "2 hours ago")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 604800)} weeks ago`

    return `${Math.floor(diffInSeconds / 2592000)} months ago`
  }

  const mockFiles = [
    // Mock files as fallback
    {
      path: 'src/components/Button.tsx',
      content: `import React from 'react';

interface ButtonProps {
variant?: 'primary' | 'secondary' | 'outline';
size?: 'sm' | 'md' | 'lg';
children: React.ReactNode;
onClick?: () => void;
disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
variant = 'primary',
size = 'md',
children,
onClick,
disabled = false,
}) => {
// Implementation details...
return (
  <button
    className={\`btn btn-\${variant} btn-\${size}\`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
};`,
      type: 'file',
      sha: 'mock-sha-1',
    },
    {
      path: 'src/hooks/useAuth.ts',
      content: `import { useState, useEffect } from 'react';

export function useAuth() {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  // Check if user is logged in
  const checkAuth = async () => {
    try {
      // TODO: Add error handling
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  checkAuth();
}, []);

const login = async (credentials) => {
  // FIXME: Implement refresh token logic
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  setUser(data.user);
  return data;
};

const logout = () => {
  // Implementation details...
};

return { user, loading, login, logout };
}`,
      type: 'file',
      sha: 'mock-sha-2',
    },
    {
      path: 'src/pages/Dashboard.tsx',
      content: `import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { Chart } from '../components/Chart';
import { Table } from '../components/Table';
import { Card } from '../components/Card';
import { fetchData } from '../utils/api';

export const Dashboard = () => {
const { user } = useAuth();
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [activeTab, setActiveTab] = useState('overview');

useEffect(() => {
  const loadData = async () => {
    try {
      const result = await fetchData('/api/dashboard');
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
}, []);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

return (
  <div className="dashboard">
    <header>
      <h1>Welcome, {user?.name}</h1>
      <div className="tabs">
        <button 
          className={\`tab \${activeTab === 'overview' ? 'active' : ''}\`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={\`tab \${activeTab === 'analytics' ? 'active' : ''}\`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          className={\`tab \${activeTab === 'settings' ? 'active' : ''}\`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>
    </header>
    
    <main>
      {activeTab === 'overview' && (
        <div className="overview">
          <div className="stats">
            <Card title="Total Users" value={data.stats.totalUsers} />
            <Card title="Active Users" value={data.stats.activeUsers} />
            <Card title="Revenue" value={data.stats.revenue} />
            <Card title="Conversion Rate" value={data.stats.conversionRate} />
          </div>
          
          <div className="charts">
            <Chart 
              title="User Growth" 
              data={data.charts.userGrowth} 
              type="line" 
            />
            <Chart 
              title="Revenue by Month" 
              data={data.charts.revenueByMonth} 
              type="bar" 
            />
          </div>
          
          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <Table data={data.recentActivity} />
          </div>
        </div>
      )}
      
      {activeTab === 'analytics' && (
        <div className="analytics">
          {/* Analytics content */}
        </div>
      )}
      
      {activeTab === 'settings' && (
        <div className="settings">
          {/* Settings content */}
        </div>
      )}
    </main>
  </div>
);
};`,
      type: 'file',
      sha: 'mock-sha-3',
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={open}>
      <DialogContent className='sm:max-w-[600px] p-0 overflow-hidden'>
        <AnimatePresence mode='wait'>
          {step === 'select' && (
            <motion.div
              key='select'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className='p-6 pb-2'>
                <DialogTitle className='text-2xl flex items-center gap-2'>
                  <Github className='h-6 w-6' />
                  Connect GitHub Repository
                </DialogTitle>
                <DialogDescription>
                  Select a repository to connect to heuristic for AI-powered
                  documentation and insights.
                </DialogDescription>
              </DialogHeader>

              <div className='p-6 pt-2 space-y-4'>
                <div className='flex gap-2'>
                  <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                    <Input
                      placeholder='Search repositories...'
                      className='pl-9 pr-4'
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={fetchRepositories}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCw className='h-4 w-4 animate-spin' />
                    ) : (
                      <RefreshCw className='h-4 w-4' />
                    )}
                  </Button>
                </div>

                {error && (
                  <div className='rounded-md bg-destructive/10 p-3 text-sm flex items-start gap-2'>
                    <AlertCircle className='h-4 w-4 text-destructive mt-0.5 shrink-0' />
                    <p className='text-destructive'>{error}</p>
                  </div>
                )}

                <div className='border rounded-lg overflow-hidden'>
                  <div className='max-h-[320px] overflow-y-auto'>
                    {isLoading ? (
                      <div className='p-8 text-center'>
                        <RefreshCw className='h-8 w-8 animate-spin mx-auto mb-4 text-primary' />
                        <div className='text-muted-foreground'>
                          Loading repositories...
                        </div>
                      </div>
                    ) : filteredRepos.length > 0 ? (
                      filteredRepos.map(repo => (
                        <div
                          key={repo.id}
                          className='flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer border-b last:border-b-0'
                          onClick={() => handleSelectRepo(repo)}
                        >
                          <div className='flex items-start gap-3'>
                            <FolderGit2 className='h-5 w-5 text-primary mt-0.5' />
                            <div>
                              <div className='font-medium flex items-center gap-2'>
                                {repo.name}
                                {repo.isPrivate && (
                                  <Badge
                                    variant='outline'
                                    className='text-xs font-normal'
                                  >
                                    Private
                                  </Badge>
                                )}
                              </div>
                              <div className='text-sm text-muted-foreground'>
                                {repo.description || 'No description'}
                              </div>
                              <div className='flex items-center gap-3 mt-1 text-xs text-muted-foreground'>
                                {repo.language && (
                                  <span className='flex items-center gap-1'>
                                    <div
                                      className={`h-2.5 w-2.5 rounded-full ${getLanguageColor(
                                        repo.language
                                      )}`}
                                    />
                                    {repo.language}
                                  </span>
                                )}
                                <span>⭐ {repo.stars}</span>
                                <span>
                                  Updated {formatDate(repo.updatedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className='h-5 w-5 text-muted-foreground' />
                        </div>
                      ))
                    ) : (
                      <div className='p-8 text-center text-muted-foreground'>
                        <div className='mb-2'>No repositories found</div>
                        <div className='text-sm'>
                          {searchQuery
                            ? 'Try a different search term'
                            : 'Connect your GitHub account to see your repositories'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className='p-6 pt-2 flex items-center justify-between'>
                <div className='text-sm text-muted-foreground'>
                  Don't see your repository?{' '}
                  <Button
                    variant='link'
                    className='h-auto p-0'
                    onClick={fetchRepositories}
                    disabled={isLoading}
                  >
                    Sync with GitHub
                  </Button>
                </div>
                <Button variant='outline' onClick={handleCancel}>
                  Cancel
                </Button>
              </DialogFooter>
            </motion.div>
          )}

          {step === 'configure' && selectedRepo && (
            <motion.div
              key='configure'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className='p-6 pb-2'>
                <DialogTitle className='text-2xl'>
                  Configure Repository
                </DialogTitle>
                <DialogDescription>
                  Customize how heuristic analyzes and documents{' '}
                  {selectedRepo.name}
                </DialogDescription>
              </DialogHeader>

              <div className='p-6 pt-2 space-y-6'>
                <div className='p-4 rounded-lg border bg-muted/30'>
                  <div className='flex items-center gap-3'>
                    <FolderGit2 className='h-5 w-5 text-primary' />
                    <div>
                      <div className='font-medium'>{selectedRepo.fullName}</div>
                      <div className='text-sm text-muted-foreground'>
                        {selectedRepo.description || 'No description'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Analysis Depth</Label>
                    <RadioGroup
                      defaultValue={scanDepth}
                      onValueChange={setScanDepth}
                      className='grid grid-cols-1 gap-2'
                    >
                      <div className='flex items-start space-x-2 rounded-md border p-3'>
                        <RadioGroupItem
                          value='basic'
                          id='basic'
                          className='mt-1'
                        />
                        <div className='space-y-1.5 leading-none'>
                          <Label htmlFor='basic' className='font-medium'>
                            Basic
                          </Label>
                          <div className='text-sm text-muted-foreground'>
                            Quick scan of main files and structure. Best for
                            small projects.
                          </div>
                        </div>
                      </div>
                      <div className='flex items-start space-x-2 rounded-md border p-3 bg-muted/30'>
                        <RadioGroupItem
                          value='standard'
                          id='standard'
                          className='mt-1'
                        />
                        <div className='space-y-1.5 leading-none'>
                          <Label htmlFor='standard' className='font-medium'>
                            Standard
                          </Label>
                          <div className='text-sm text-muted-foreground'>
                            Comprehensive analysis of code, structure, and
                            dependencies. Recommended for most projects.
                          </div>
                        </div>
                      </div>
                      <div className='flex items-start space-x-2 rounded-md border p-3'>
                        <RadioGroupItem
                          value='deep'
                          id='deep'
                          className='mt-1'
                        />
                        <div className='space-y-1.5 leading-none'>
                          <Label htmlFor='deep' className='font-medium'>
                            Deep
                          </Label>
                          <div className='text-sm text-muted-foreground'>
                            In-depth analysis including historical changes and
                            complex relationships. Best for large projects.
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className='space-y-2'>
                    <Label htmlFor='branches'>Branches to Include</Label>
                    <Select
                      defaultValue={includeBranches[0]}
                      onValueChange={value => setIncludeBranches([value])}
                    >
                      <SelectTrigger id='branches'>
                        <SelectValue placeholder='Select branches' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='main'>main only</SelectItem>
                        <SelectItem value='all'>All branches</SelectItem>
                        <SelectItem value='main-dev'>
                          main and development
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='exclude'>Exclude Patterns</Label>
                    <Input
                      id='exclude'
                      placeholder='node_modules/,dist/,.git/'
                      value={excludePatterns}
                      onChange={e => setExcludePatterns(e.target.value)}
                    />
                    <div className='text-xs text-muted-foreground'>
                      Comma-separated patterns of files and directories to
                      exclude from analysis
                    </div>
                  </div>

                  <div className='flex items-center space-x-2 pt-2'>
                    <Checkbox
                      id='auto-sync'
                      checked={autoSync}
                      onCheckedChange={checked =>
                        setAutoSync(checked as boolean)
                      }
                    />
                    <Label htmlFor='auto-sync'>
                      Automatically sync documentation when repository changes
                    </Label>
                  </div>
                </div>

                <DialogFooter className='flex justify-between p-0'>
                  <Button variant='outline' onClick={() => setStep('select')}>
                    Back
                  </Button>
                  <Button onClick={handleStartAnalysis} className='gap-2'>
                    <ArrowRight className='h-4 w-4' />
                    Start Analysis
                  </Button>
                </DialogFooter>
              </div>
            </motion.div>
          )}

          {step === 'analyzing' && selectedRepo && (
            <motion.div
              key='analyzing'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className='p-6 flex flex-col items-center justify-center min-h-[400px]'
            >
              <div className='w-full max-w-md text-center space-y-6'>
                <div className='relative flex items-center justify-center'>
                  <div className='absolute'>
                    <Loader2 className='h-12 w-12 animate-spin text-primary' />
                  </div>
                  <div className='text-2xl font-bold'>{analysisProgress}%</div>
                </div>

                <div>
                  <h3 className='text-xl font-semibold mb-2'>
                    Analyzing Repository
                  </h3>
                  <p className='text-muted-foreground'>
                    heuristic is scanning {selectedRepo.name} to generate
                    documentation and insights. This may take a few minutes
                    depending on the repository size.
                  </p>
                </div>

                <Progress value={analysisProgress} className='h-2.5' />

                <div className='text-sm text-muted-foreground'>
                  {analysisProgress < 30 && 'Cloning repository...'}
                  {analysisProgress >= 30 &&
                    analysisProgress < 60 &&
                    'Analyzing code structure...'}
                  {analysisProgress >= 60 &&
                    analysisProgress < 90 &&
                    'Identifying patterns...'}
                  {analysisProgress >= 90 && 'Finalizing analysis...'}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'documenting' && selectedRepo && (
            <motion.div
              key='documenting'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className='p-6 flex flex-col items-center justify-center min-h-[400px]'
            >
              <div className='w-full max-w-md text-center space-y-6'>
                <div className='relative flex items-center justify-center'>
                  <div className='absolute'>
                    <Loader2 className='h-12 w-12 animate-spin text-primary' />
                  </div>
                  <div className='text-2xl font-bold'>
                    {documentationProgress}%
                  </div>
                </div>

                <div>
                  <h3 className='text-xl font-semibold mb-2'>
                    Generating Documentation
                  </h3>
                  <p className='text-muted-foreground'>
                    AI is now generating comprehensive documentation for{' '}
                    {selectedRepo.name}. This includes code analysis, insights,
                    and refactoring suggestions.
                  </p>
                </div>

                <Progress value={documentationProgress} className='h-2.5' />

                <div className='text-sm text-muted-foreground'>
                  {documentationProgress < 30 && 'Analyzing code complexity...'}
                  {documentationProgress >= 30 &&
                    documentationProgress < 60 &&
                    'Generating documentation sections...'}
                  {documentationProgress >= 60 &&
                    documentationProgress < 90 &&
                    'Creating refactoring suggestions...'}
                  {documentationProgress >= 90 && 'Finalizing documentation...'}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'complete' && selectedRepo && (
            <motion.div
              key='complete'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className='p-6 flex flex-col items-center justify-center min-h-[400px]'
            >
              <div className='w-full max-w-md text-center space-y-6'>
                <div className='flex items-center justify-center'>
                  <div className='h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center'>
                    <Check className='h-8 w-8 text-green-600 dark:text-green-400' />
                  </div>
                </div>

                <div>
                  <h3 className='text-xl font-semibold mb-2'>
                    Repository Connected!
                  </h3>
                  <p className='text-muted-foreground'>
                    {selectedRepo.name} has been successfully connected to
                    heuristic. Your documentation and insights are ready to
                    explore.
                  </p>
                </div>

                <div className='p-4 rounded-lg border bg-muted/30 text-left'>
                  <div className='text-sm font-medium mb-2'>
                    Analysis Summary
                  </div>
                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    <div className='text-muted-foreground'>Files Analyzed:</div>
                    <div className='font-medium'>3</div>
                    <div className='text-muted-foreground'>
                      Documentation Coverage:
                    </div>
                    <div className='font-medium'>92%</div>
                    <div className='text-muted-foreground'>
                      Insights Generated:
                    </div>
                    <div className='font-medium'>8</div>
                    <div className='text-muted-foreground'>
                      Code Quality Score:
                    </div>
                    <div className='font-medium'>B+</div>
                  </div>
                </div>

                <div className='flex gap-4 justify-center'>
                  <Button onClick={handleComplete} className='gap-2'>
                    View Project
                    <ArrowRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
