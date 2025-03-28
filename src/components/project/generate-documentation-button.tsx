'use client'

import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useGenerateDocumentation } from '@/use-generate-documentation'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getRepoContentsAction } from '@/actions'

interface GenerateDocumentationButtonProps {
  projectId: string
  projectName: string
  repositoryUrl?: string
  language?: string | null
  disabled?: boolean
  onSuccess?: () => void
}

export function GenerateDocumentationButton({
  projectId,
  projectName,
  repositoryUrl,
  language,
  disabled = false,
  onSuccess,
}: GenerateDocumentationButtonProps) {
  const { generateProjectDocumentation, isGenerating, loadingStates } =
    useGenerateDocumentation()
  const router = useRouter()

  // Convert projectId to string if it's a number
  const projectIdString = String(projectId)

  const isLoading = isGenerating || loadingStates[projectIdString]

  const handleGenerateDocumentation = async () => {
    // In a real implementation, you would fetch the repository files here
    // For this example, we'll use mock data
    const mockFiles = [
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
        language: 'TypeScript',
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
        language: 'TypeScript',
      },
      // Add more mock files as needed
    ]

    try {
      // Extract owner and repo from repositoryUrl
      let owner = ''
      let repoName = ''

      if (repositoryUrl) {
        const urlParts = repositoryUrl.split('/')
        if (urlParts.length >= 2) {
          owner = urlParts[urlParts.length - 2]
          repoName = urlParts[urlParts.length - 1]
        }
      }

      let files = []

      if (owner && repoName) {
        try {
          // Fetch repository contents
          const repoContents = await getRepoContentsAction(owner, repoName)

          // Map to the format expected by generateProjectDocumentation
          files = repoContents.map(file => ({
            path: file.path,
            content: file.content,
            language: getLanguageFromPath(file.path),
          }))

          toast.info('Fetched repository files', {
            description: `Found ${files.length} files in ${owner}/${repoName}`,
          })
        } catch (error) {
          console.error('Error fetching repository contents:', error)
          toast.error('Failed to fetch repository contents', {
            description: 'Using mock data instead.',
          })

          // Fall back to mock data
          files = mockFiles
        }
      } else {
        // Use mock data if no repository URL is provided
        files = mockFiles
      }

      const documentation = await generateProjectDocumentation(
        String(projectId),
        projectName,
        files,
        {
          repositoryUrl,
          language,
          description:
            'A modern web application built with React and TypeScript',
          dependencies: {
            react: '^18.2.0',
            next: '^14.0.0',
            typescript: '^5.0.0',
          },
        }
      )

      if (documentation && onSuccess) {
        onSuccess()
      }

      // Navigate to the project page to view the documentation
      if (documentation) {
        router.push(`/dashboard/project/${projectIdString}`)
      }
    } catch (error) {
      console.error('Error generating documentation:', error)
      toast.error('Failed to generate documentation', {
        description: 'An unexpected error occurred.',
      })
    }
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

  return (
    <Button
      variant='outline'
      size='sm'
      className='gap-2 rounded-full'
      onClick={handleGenerateDocumentation}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <RefreshCw className='h-3.5 w-3.5 animate-spin' />
          Generating...
        </>
      ) : (
        <>
          <RefreshCw className='h-3.5 w-3.5' />
          Generate Docs
        </>
      )}
    </Button>
  )
}
