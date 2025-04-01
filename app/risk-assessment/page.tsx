"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-context"
import { useRouter } from "next/navigation"
import {
  BarChart,
  PieChart,
  LineChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
  Cell,
  Line,
} from "recharts"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Save,
  RefreshCw,
  Download,
  Upload,
  FileText,
} from "lucide-react"

// Mock data for risk assessment models
const riskModels = [
  { id: "model1", name: "Credit Score Model", accuracy: 87, status: "active" },
  { id: "model2", name: "Income Verification Model", accuracy: 92, status: "active" },
  { id: "model3", name: "Fraud Detection Model", accuracy: 78, status: "active" },
  { id: "model4", name: "Document Verification Model", accuracy: 85, status: "inactive" },
  { id: "model5", name: "Behavioral Analysis Model", accuracy: 73, status: "training" },
]

// Mock data for risk factors
const riskFactors = [
  { factor: "Credit Score", weight: 35, threshold: 650 },
  { factor: "Debt-to-Income Ratio", weight: 25, threshold: 43 },
  { factor: "Loan-to-Income Ratio", weight: 20, threshold: 3.5 },
  { factor: "Employment Stability", weight: 10, threshold: 2 },
  { factor: "Payment History", weight: 10, threshold: 90 },
]

// Mock data for risk distribution
const riskDistribution = [
  { name: "Very Low", value: 15, color: "#10b981" },
  { name: "Low", value: 25, color: "#22c55e" },
  { name: "Medium", value: 30, color: "#eab308" },
  { name: "High", value: 20, color: "#f97316" },
  { name: "Very High", value: 10, color: "#ef4444" },
]

// Mock data for risk trends
const riskTrends = [
  { month: "Jan", avgRiskScore: 62, approvalRate: 75 },
  { month: "Feb", avgRiskScore: 65, approvalRate: 72 },
  { month: "Mar", avgRiskScore: 60, approvalRate: 78 },
  { month: "Apr", avgRiskScore: 58, approvalRate: 80 },
  { month: "May", avgRiskScore: 63, approvalRate: 76 },
  { month: "Jun", avgRiskScore: 67, approvalRate: 70 },
]

// Mock data for recent risk assessments
const recentAssessments = [
  { id: "app-123", applicant: "John Smith", score: 82, recommendation: "approve", date: "2023-06-15" },
  { id: "app-124", applicant: "Sarah Johnson", score: 45, recommendation: "reject", date: "2023-06-14" },
  { id: "app-125", applicant: "Michael Brown", score: 68, recommendation: "review", date: "2023-06-14" },
  { id: "app-126", applicant: "Emily Davis", score: 75, recommendation: "approve", date: "2023-06-13" },
  { id: "app-127", applicant: "Robert Wilson", score: 38, recommendation: "reject", date: "2023-06-13" },
]

export default function RiskAssessmentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isUpdating, setIsUpdating] = useState(false)
  const [editedFactors, setEditedFactors] = useState(riskFactors)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user?.role !== "officer") {
      router.push("/dashboard")
    }
  }, [loading, user, router])

  const handleFactorChange = (index: number, field: string, value: number) => {
    const newFactors = [...editedFactors]
    newFactors[index] = { ...newFactors[index], [field]: value }
    setEditedFactors(newFactors)
  }

  const handleSaveFactors = () => {
    setIsUpdating(true)
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false)
      toast({
        title: "Risk factors updated",
        description: "Your changes have been saved successfully.",
      })
    }, 1000)
  }

  const handleModelToggle = (modelId: string, active: boolean) => {
    toast({
      title: active ? "Model activated" : "Model deactivated",
      description: `The model has been ${active ? "activated" : "deactivated"} successfully.`,
    })
  }

  const handleExportData = () => {
    toast({
      title: "Data exported",
      description: "Risk assessment data has been exported successfully.",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user || user.role !== "officer") {
    return null
  }

  return (
    <DashboardLayout userRole={user.role}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Risk Assessment</h1>
        <p className="text-muted-foreground">AI-powered risk assessment tools and analytics</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="factors">Risk Factors</TabsTrigger>
          <TabsTrigger value="history">Assessment History</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
                <div className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">63/100</div>
                <p className="text-xs text-muted-foreground">+2 points from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                <div className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75%</div>
                <p className="text-xs text-muted-foreground">-3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
                <div className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">+1.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Fraud Detection</CardTitle>
                <div className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">12 potential fraud cases</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Risk Score Trends</CardTitle>
                <CardDescription>Average risk score and approval rate over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="avgRiskScore"
                        stroke="#8884d8"
                        name="Avg Risk Score"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="approvalRate"
                        stroke="#82ca9d"
                        name="Approval Rate %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Distribution of risk levels across applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Risk Assessments</CardTitle>
              <CardDescription>Latest application risk assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAssessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.id}</TableCell>
                      <TableCell>{assessment.applicant}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{assessment.score}</span>
                          <Progress
                            value={assessment.score}
                            max={100}
                            className="w-24"
                            style={{
                              backgroundColor:
                                assessment.score >= 70 ? "#10b981" : assessment.score >= 60 ? "#eab308" : "#ef4444",
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            assessment.recommendation === "approve"
                              ? "success"
                              : assessment.recommendation === "reject"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {assessment.recommendation === "approve" && <CheckCircle className="mr-1 h-3 w-3" />}
                          {assessment.recommendation === "reject" && <XCircle className="mr-1 h-3 w-3" />}
                          {assessment.recommendation === "review" && <AlertTriangle className="mr-1 h-3 w-3" />}
                          {assessment.recommendation}
                        </Badge>
                      </TableCell>
                      <TableCell>{assessment.date}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/applications/${assessment.id.replace("app-", "")}`}>View</a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Risk Assessment Models</CardTitle>
              <CardDescription>Manage and monitor AI models used for risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {riskModels.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-medium">{model.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Accuracy: {model.accuracy}%</span>
                        <Badge
                          variant={
                            model.status === "active"
                              ? "success"
                              : model.status === "training"
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {model.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={model.status === "active"}
                        onCheckedChange={(checked) => handleModelToggle(model.id, checked)}
                        disabled={model.status === "training"}
                      />
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Model
              </Button>
              <Button>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retrain Models
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Performance</CardTitle>
              <CardDescription>Performance metrics for active AI models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={riskModels.filter((m) => m.status === "active")}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="accuracy" name="Accuracy %" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factors" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Factor Configuration</CardTitle>
              <CardDescription>Adjust weights and thresholds for risk assessment factors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {editedFactors.map((factor, index) => (
                  <div key={factor.factor} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{factor.factor}</h3>
                      <Badge variant="outline">{factor.weight}% weight</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Factor Weight (%)</span>
                        <span>{factor.weight}%</span>
                      </div>
                      <Slider
                        value={[factor.weight]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value) => handleFactorChange(index, "weight", value[0])}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Threshold Value</span>
                        <span>{factor.threshold}</span>
                      </div>
                      <Slider
                        value={[factor.threshold]}
                        min={0}
                        max={1000}
                        step={10}
                        onValueChange={(value) => handleFactorChange(index, "threshold", value[0])}
                      />
                    </div>
                    <div className="border-b pb-2" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveFactors} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Assessment History</CardTitle>
                  <CardDescription>Historical risk assessment data and results</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search by ID or name" className="w-64" />
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Assessor</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>{new Date(2023, 5, 15 - i).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">APP-{1000 + i}</TableCell>
                      <TableCell>
                        {["John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "Robert Wilson"][i % 5]}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{Math.floor(40 + Math.random() * 50)}</span>
                          <Progress value={Math.floor(40 + Math.random() * 50)} max={100} className="w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={i % 3 === 0 ? "success" : i % 3 === 1 ? "destructive" : "outline"}>
                          {i % 3 === 0 ? "Approved" : i % 3 === 1 ? "Rejected" : "Manual Review"}
                        </Badge>
                      </TableCell>
                      <TableCell>{i % 2 === 0 ? "AI System" : "Loan Officer"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Showing 10 of 234 entries</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

