"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCode, Github, RefreshCw } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function RecentProjects() {
  // Mock project data
  const projects = [
    {
      id: "1",
      name: "frontend-app",
      description: "React frontend application with TypeScript",
      status: "up-to-date",
      lastUpdated: "2 hours ago",
      stars: 24,
      language: "TypeScript",
    },
    {
      id: "2",
      name: "api-service",
      description: "REST API service with Express and MongoDB",
      status: "needs-update",
      lastUpdated: "3 days ago",
      stars: 18,
      language: "JavaScript",
    },
    {
      id: "3",
      name: "data-processor",
      description: "Data processing pipeline with Python",
      status: "processing",
      lastUpdated: "1 day ago",
      stars: 12,
      language: "Python",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "up-to-date":
        return <span className="h-2 w-2 rounded-full bg-green-500" />
      case "needs-update":
        return <span className="h-2 w-2 rounded-full bg-yellow-500" />
      case "processing":
        return <span className="h-2 w-2 rounded-full bg-blue-500" />
      default:
        return null
    }
  }

  const getLanguageColor = (language: string) => {
    switch (language) {
      case "TypeScript":
        return "bg-blue-500"
      case "JavaScript":
        return "bg-yellow-500"
      case "Python":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="border-0 shadow-md elegant-card">
      <CardHeader className="elegant-card-header">
        <CardTitle>Recent Projects</CardTitle>
        <CardDescription>Your recently updated projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/dashboard/project/${project.id}`} className="block">
                <div className="flex items-start justify-between rounded-xl border p-4 transition-all duration-200 hover:bg-muted/50 hover:shadow-md hover:-translate-y-1 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full w-1"
                    style={{
                      background: `var(--${getLanguageColor(project.language).replace("bg-", "")})`,
                    }}
                  ></div>
                  <div className="space-y-1 pl-2">
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-primary" />
                      <span className="font-medium">{project.name}</span>
                      <Badge variant="outline" className="flex items-center gap-1 font-normal rounded-full">
                        {getStatusIcon(project.status)}
                        <span className="ml-1 text-xs">{project.status.replace("-", " ")}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Github className="h-3 w-3" />
                        {project.stars} stars
                      </span>
                      <span>•</span>
                      <span>Updated {project.lastUpdated}</span>
                    </div>
                  </div>
                  <RefreshCw className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

