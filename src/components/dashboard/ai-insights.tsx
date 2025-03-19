"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FileCode } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function AIInsights() {
  // Mock insights data
  const insights = [
    {
      id: "1",
      project: "frontend-app",
      file: "src/pages/Dashboard.tsx",
      type: "High Complexity",
      description: "This component has too many responsibilities and should be split into smaller components.",
      priority: "high",
    },
    {
      id: "2",
      project: "api-service",
      file: "src/controllers/auth.js",
      type: "Security Issue",
      description: "The JWT token is not being properly validated before use.",
      priority: "high",
    },
    {
      id: "3",
      project: "frontend-app",
      file: "src/hooks/useAuth.ts",
      type: "Improve Error Handling",
      description: "The authentication hook lacks comprehensive error handling.",
      priority: "medium",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400"
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400"
      case "low":
        return "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
      default:
        return ""
    }
  }

  return (
    <Card className="border-0 shadow-md elegant-card">
      <CardHeader className="elegant-card-header">
        <CardTitle>AI Insights</CardTitle>
        <CardDescription>AI-generated insights to improve your code</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="rounded-xl border p-4 shadow-sm bg-gradient-to-r from-primary/5 to-transparent transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{insight.type}</h4>
                      <Badge
                        variant="outline"
                        className={`font-normal rounded-full ${getPriorityColor(insight.priority)}`}
                      >
                        {insight.priority}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{insight.project}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FileCode className="h-3.5 w-3.5 text-primary" />
                        {insight.file}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{insight.description}</p>
                  </div>
                  <Link href={`/dashboard/project/${insight.project === "frontend-app" ? "1" : "2"}`}>
                    <Button variant="outline" size="sm" className="mt-2 gap-1 sm:mt-0 rounded-full">
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="flex justify-center">
            <Link href="/dashboard/insights">
              <Button variant="outline" className="gap-2 rounded-full">
                View All Insights
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

