import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, ArrowRight, Code, FileCode, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">AI Insights</h2>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Insights
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="complexity">Code Complexity</TabsTrigger>
          <TabsTrigger value="suggestions">Refactoring Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Across all projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Require immediate attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Code Quality Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">B+</div>
                <p className="text-xs text-muted-foreground">Improved from B-</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Implemented Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">In the last 30 days</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Insights</CardTitle>
              <CardDescription>AI-generated insights across your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    project: "frontend-app",
                    file: "src/pages/Dashboard.tsx",
                    type: "High Complexity",
                    description:
                      "This component has too many responsibilities and should be split into smaller components.",
                    priority: "high",
                  },
                  {
                    project: "api-service",
                    file: "src/controllers/auth.js",
                    type: "Security Issue",
                    description: "The JWT token is not being properly validated before use.",
                    priority: "high",
                  },
                  {
                    project: "frontend-app",
                    file: "src/hooks/useAuth.ts",
                    type: "Improve Error Handling",
                    description: "The authentication hook lacks comprehensive error handling.",
                    priority: "medium",
                  },
                  {
                    project: "data-processor",
                    file: "src/utils/transform.py",
                    type: "Performance Issue",
                    description: "This function is using an inefficient algorithm for data transformation.",
                    priority: "medium",
                  },
                ].map((insight, index) => (
                  <div key={index} className="rounded-md border p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{insight.type}</h4>
                          <Badge
                            variant={
                              insight.priority === "high"
                                ? "destructive"
                                : insight.priority === "medium"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {insight.priority}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{insight.project}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <FileCode className="h-3.5 w-3.5" />
                            {insight.file}
                          </span>
                        </div>
                        <p className="mt-2 text-sm">{insight.description}</p>
                      </div>
                      <Link href={`/dashboard/project/1`}>
                        <Button variant="outline" size="sm" className="mt-2 gap-1 sm:mt-0">
                          View Details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complexity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Complexity Analysis</CardTitle>
              <CardDescription>Identify complex areas of your codebase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">frontend-app</h3>
                  <div className="mt-4 space-y-4">
                    {[
                      { file: "src/pages/Dashboard.tsx", complexity: "high", score: 32 },
                      { file: "src/components/DataTable.tsx", complexity: "medium", score: 24 },
                      { file: "src/hooks/useData.ts", complexity: "medium", score: 18 },
                      { file: "src/components/Modal.tsx", complexity: "low", score: 12 },
                      { file: "src/utils/api.ts", complexity: "low", score: 8 },
                    ].map((file, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <FileCode className="h-4 w-4 text-muted-foreground" />
                            {file.file}
                          </span>
                          <span className="font-medium">Score: {file.score}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className={`h-2 rounded-full ${
                                file.complexity === "low"
                                  ? "complexity-low"
                                  : file.complexity === "medium"
                                    ? "complexity-medium"
                                    : "complexity-high"
                              }`}
                              style={{ width: `${(file.score / 40) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium capitalize">{file.complexity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">api-service</h3>
                  <div className="mt-4 space-y-4">
                    {[
                      { file: "src/controllers/data.js", complexity: "high", score: 35 },
                      { file: "src/services/auth.js", complexity: "medium", score: 22 },
                      { file: "src/middleware/validation.js", complexity: "medium", score: 20 },
                      { file: "src/utils/logger.js", complexity: "low", score: 10 },
                      { file: "src/config/database.js", complexity: "low", score: 6 },
                    ].map((file, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <FileCode className="h-4 w-4 text-muted-foreground" />
                            {file.file}
                          </span>
                          <span className="font-medium">Score: {file.score}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className={`h-2 rounded-full ${
                                file.complexity === "low"
                                  ? "complexity-low"
                                  : file.complexity === "medium"
                                    ? "complexity-medium"
                                    : "complexity-high"
                              }`}
                              style={{ width: `${(file.score / 40) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium capitalize">{file.complexity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Refactoring Suggestions</CardTitle>
              <CardDescription>AI-powered recommendations to improve code quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-lg font-medium">High Priority Suggestions</h3>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h4 className="font-medium">Split Dashboard Component</h4>
                          <p className="mt-1 text-sm text-muted-foreground">frontend-app/src/pages/Dashboard.tsx</p>
                          <p className="mt-2 text-sm">
                            This component has too many responsibilities and should be split into smaller components.
                          </p>
                        </div>
                        <Link href={`/dashboard/project/1`}>
                          <Button variant="outline" size="sm" className="mt-2 gap-1 sm:mt-0">
                            View Details
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                      <Separator className="my-4" />
                      <div className="ai-suggestion text-sm">
                        <p>Consider extracting the data visualization section into a separate component:</p>
                        <pre className="mt-2 text-xs">
                          {`// Extract this section
const DataVisualization = ({ data }) => {
  return (
    <div className="charts">
      {/* Chart components */}
    </div>
  );
};`}
                        </pre>
                      </div>
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h4 className="font-medium">Improve JWT Validation</h4>
                          <p className="mt-1 text-sm text-muted-foreground">api-service/src/controllers/auth.js</p>
                          <p className="mt-2 text-sm">
                            The JWT token is not being properly validated before use, creating a potential security
                            vulnerability.
                          </p>
                        </div>
                        <Link href={`/dashboard/project/2`}>
                          <Button variant="outline" size="sm" className="mt-2 gap-1 sm:mt-0">
                            View Details
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                      <Separator className="my-4" />
                      <div className="ai-suggestion text-sm">
                        <p>Add proper token validation:</p>
                        <pre className="mt-2 text-xs">
                          {`// Add this validation
const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return { valid: false, error: 'Token expired' };
    }
    
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-medium">Medium Priority Suggestions</h3>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h4 className="font-medium">Improve Error Handling</h4>
                          <p className="mt-1 text-sm text-muted-foreground">frontend-app/src/hooks/useAuth.ts</p>
                          <p className="mt-2 text-sm">The authentication hook lacks comprehensive error handling.</p>
                        </div>
                        <Link href={`/dashboard/project/1`}>
                          <Button variant="outline" size="sm" className="mt-2 gap-1 sm:mt-0">
                            View Details
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                      <Separator className="my-4" />
                      <div className="ai-suggestion text-sm">
                        <p>Add more specific error handling:</p>
                        <pre className="mt-2 text-xs">
                          {`try {
  // Authentication logic
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
    return { error: 'Invalid credentials' };
  } else if (error.response?.status === 403) {
    // Handle forbidden
    return { error: 'Access denied' };
  } else {
    // Handle other errors
    return { error: 'Authentication failed' };
  }
}`}
                        </pre>
                      </div>
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h4 className="font-medium">Optimize Data Transformation</h4>
                          <p className="mt-1 text-sm text-muted-foreground">data-processor/src/utils/transform.py</p>
                          <p className="mt-2 text-sm">
                            This function is using an inefficient algorithm for data transformation.
                          </p>
                        </div>
                        <Link href={`/dashboard/project/3`}>
                          <Button variant="outline" size="sm" className="mt-2 gap-1 sm:mt-0">
                            View Details
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                      <Separator className="my-4" />
                      <div className="ai-suggestion text-sm">
                        <p>Replace the nested loops with a more efficient approach:</p>
                        <pre className="mt-2 text-xs">
                          {`# Replace this
def transform_data(data):
    result = []
    for item in data:
        for field in item:
            # Processing logic
    return result

# With this
def transform_data(data):
    # Use list comprehension for better performance
    return [
        process_item(field)
        for item in data
        for field in item
    ]`}
                        </pre>
                      </div>
                    </div>
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

