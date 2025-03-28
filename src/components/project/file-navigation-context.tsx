'use client'

import type React from 'react'
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  Dispatch,
} from 'react'

export interface ProjectFile {
  path: string
  complexity?: 'low' | 'medium' | 'high'
  language?: string
  content?: string
}

interface FileNavigationContextType {
  projectFiles: ProjectFile[]
  currentFile: ProjectFile | null
  fileHistory: ProjectFile[]
  recentlyViewedFiles: ProjectFile[]
  navigateToFile: (filePath: string) => void
  goBack: () => void
  goForward: () => void
  selectFile: Dispatch<React.SetStateAction<ProjectFile | null>>
}

const FileNavigationContext = createContext<FileNavigationContextType>({
  projectFiles: [],
  currentFile: null,
  fileHistory: [],
  recentlyViewedFiles: [],
  navigateToFile: () => {},
  goBack: () => {},
  goForward: () => {},
  selectFile: () => {},
})

export const useFileNavigation = () => useContext(FileNavigationContext)

interface FileNavigationProviderProps {
  children: React.ReactNode
  projectFiles: ProjectFile[]
}

export function FileNavigationProvider({
  children,
  projectFiles,
}: FileNavigationProviderProps) {
  const [currentFile, setCurrentFile] = useState<ProjectFile | null>(null)
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [history, setHistory] = useState<ProjectFile[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<ProjectFile[]>([])

  const navigateToFile = useCallback(
    (filePath: string) => {
      const file = projectFiles.find(f => f.path === filePath)
      if (!file) return
      setCurrentFile(file)
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(file)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)

      setRecentlyViewed(prev => {
        const filtered = prev.filter(f => f.path !== file.path)
        return [file, ...filtered].slice(0, 5)
      })
    },
    [projectFiles, history, historyIndex]
  )

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCurrentFile(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCurrentFile(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  const value = useMemo(
    () => ({
      projectFiles,
      currentFile,
      fileHistory: history,
      recentlyViewedFiles: recentlyViewed,
      navigateToFile,
      goBack,
      goForward,
      selectFile: setCurrentFile,
    }),
    [
      projectFiles,
      currentFile,
      history,
      recentlyViewed,
      navigateToFile,
      goBack,
      goForward,
    ]
  )

  return (
    <FileNavigationContext.Provider value={value}>
      {children}
    </FileNavigationContext.Provider>
  )
}
