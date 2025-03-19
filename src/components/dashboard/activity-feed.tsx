"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileCode, GitBranch, GitPullRequest, MessageSquare } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function ActivityFeed() {
  // Mock activity data
  const activities = [
    {
      id: "1",
      type: "commit",
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
      project: "frontend-app",
      message: "Added authentication components",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "pull_request",
      user: {
        name: "Maria Garcia",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MG",
      },
      project: "api-service",
      message: "Refactored data fetching logic",
      time: "5 hours ago",
    },
    {
      id: "3",
      type: "comment",
      user: {
        name: "Sam Taylor",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "ST",
      },
      project: "frontend-app",
      message: "Left a comment on PR #42",
      time: "1 day ago",
    },
    {
      id: "4",
      type: "branch",
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
      project: "data-processor",
      message: "Created branch feature/data-pipeline",
      time: "1 day ago",
    },
    {
      id: "5",
      type: "commit",
      user: {
        name: "Maria Garcia",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MG",
      },
      project: "api-service",
      message: "Fixed authentication bug",
      time: "2 days ago",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "commit":
        return <FileCode className="h-4 w-4 text-primary" />
      case "pull_request":
        return <GitPullRequest className="h-4 w-4 text-primary" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-primary" />
      case "branch":
        return <GitBranch className="h-4 w-4 text-primary" />
      default:
        return <FileCode className="h-4 w-4 text-primary" />
    }
  }

  return (
    <Card className="border-0 shadow-md elegant-card">
      <CardHeader className="elegant-card-header">
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>Recent activity across your projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="flex gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback className="bg-primary/10 text-primary">{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">
                    {activity.type === "commit"
                      ? "committed"
                      : activity.type === "pull_request"
                        ? "opened a pull request"
                        : activity.type === "comment"
                          ? "commented"
                          : "created a branch"}
                  </span>{" "}
                  on{" "}
                  <Link
                    href={`/dashboard/project/${activity.project === "frontend-app" ? "1" : activity.project === "api-service" ? "2" : "3"}`}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {activity.project}
                  </Link>
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    {getActivityIcon(activity.type)}
                    {activity.message}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

