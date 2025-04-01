"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-context"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  Download,
  FileText,
  Eye,
  ThumbsUp,
  ThumbsDown,
  BarChart,
  RefreshCw,
} from "lucide-react"
import {
  BarChart as RechartsBarChart,
  PieChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
  Cell,
} from "recharts"

// Mock data for pending approvals
const pendingApprovals = [
  {
    id: "app-101",
    applicant: "John Smith",
    amount: 25000,
    term: 36,
    purpose: "Home renovation",
    score: 82,
    status: "pending",
    date: "2023-06-15",
    aiRecommendation: "approve",
  },
  {
    id: "app-102",
    applicant: "Sarah Johnson",
    amount: 10000,
    term: 24,
    purpose: "Debt consolidation",
    score: 65,
    status: "pending",
    date: "2023-06-14",
    aiRecommendation: "review",
  },
  {
    id: "app-103",
    applicant: "Michael Brown",
    amount: 50000,
    term: 60,
    purpose: "Business expansion",
    score: 78,
    status: "pending",
    date: "2023-06-14",
    aiRecommendation: "approve",
  },
  {
    id: "app-104",
    applicant: "Emily Davis",
    amount: 15000,
    term: 36,
    purpose: "Car purchase",
    score: 45,
    status: "pending",
    date: "2023-06-13",
    aiRecommendation: "reject",
  },
  {
    id: "app-105",
    applicant: "Robert Wilson",
    amount: 75000,
    term: 120,
    purpose: "Investment property",
    score: 72,
    status: "pending",
    date: "2023-06-13",
    aiRecommendation: "approve",
  },
]

// Mock data for approval statistics
const approvalStats = [
  { name: "Approved", value: 65, color: "#10b981" },
  { name: "Rejected", value: 25, color: "#ef4444" },
  { name: "Manual Review", value: 10, color: "#f59e0b" },
]

// Mock data for approval trends
const approvalTrends = [
  { month: "Jan", approved: 45, rejected: 15, review: 8 },
  { month: "Feb", approved: 50, rejected: 18, review: 7 },
  { month: "Mar", approved: 42, rejected: 20, review: 10 },
  { month: "Apr", approved: 48, rejected: 16, review: 6 },
  { month: "May", approved: 52, rejected: 14, review: 9 },
  { month: "Jun", approved: 58, rejected: 12, review: 5 },
]

export default function ApprovalsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [approvalNote, setApprovalNote] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredApprovals, setFilteredApprovals] = useState(pendingApprovals)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user?.role !== "officer") {
      router.push("/dashboard")
    }
  }, [loading, user, router])

  useEffect(() => {
    // Filter approvals based on search term
    if (searchTerm) {
      setFilteredApprovals(
        pendingApprovals.filter(
          (app) =>
            app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.purpose.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    } else {
      setFilteredApprovals(pendingApprovals)
    }
  }, [searchTerm])

  const handleApprove = (application: any) => {
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Application approved",
        description: `Application ${application.id} has been approved successfully.`,
      })
      // Close dialog if open
      setSelectedApplication(null)
    }, 1000)
  }

  const handleReject = (application: any) => {
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Application rejected",
        description: `Application ${application.id} has been rejected.`,
      })
      // Close dialog if open
      setSelectedApplication(null)
    }, 1000)
  }

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application)
    setApprovalNote("")
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
        <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
        <p className="text-muted-foreground">Manage loan approvals and decisions</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="history">Approval History</TabsTrigger>
          <TabsTrigger value="analytics">Approval Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Pending Approvals</CardTitle>
                  <CardDescription>Applications awaiting approval decision</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search applications..."
                      className="pl-8 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>AI Recommendation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No pending approvals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApprovals.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.id}</TableCell>
                        <TableCell>{application.applicant}</TableCell>
                        <TableCell>${formatCurrency(application.amount)}</TableCell>
                        <TableCell>{application.purpose}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{application.score}</span>
                            <Progress
                              value={application.score}
                              max={100}
                              className="w-24"
                              style={{
                                backgroundColor:
                                  application.score >= 70 ? "#10b981" : application.score >= 60 ? "#eab308" : "#ef4444",
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              application.aiRecommendation === "approve"
                                ? "success"
                                : application.aiRecommendation === "reject"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {application.aiRecommendation === "approve" && <CheckCircle className="mr-1 h-3 w-3" />}
                            {application.aiRecommendation === "reject" && <XCircle className="mr-1 h-3 w-3" />}
                            {application.aiRecommendation === "review" && <AlertTriangle className="mr-1 h-3 w-3" />}
                            {application.aiRecommendation}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(application)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-success"
                              onClick={() => handleApprove(application)}
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleReject(application)}
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredApprovals.length} of {pendingApprovals.length} pending approvals
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Approval History</CardTitle>
                  <CardDescription>Past approval decisions</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search history..." className="pl-8 w-64" />
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
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
                    <TableHead>Amount</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const date = new Date()
                    return (
                      <TableRow key={i}>
                        <TableCell>{new Date(date.setDate(date.getDate() - i)).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">APP-{1000 + i}</TableCell>
                        <TableCell>
                          {["John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "Robert Wilson"][i % 5]}
                        </TableCell>
                        <TableCell>${formatCurrency(Math.floor(10000 + Math.random() * 90000))}</TableCell>
                        <TableCell>
                          <Badge variant={i % 3 === 0 ? "success" : i % 3 === 1 ? "destructive" : "outline"}>
                            {i % 3 === 0 ? "Approved" : i % 3 === 1 ? "Rejected" : "Manual Review"}
                          </Badge>
                        </TableCell>
                        <TableCell>{["Jane Smith", "Mark Johnson", "AI System"][i % 3]}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Showing 10 of 156 entries</div>
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

        <TabsContent value="analytics" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Rejection Rate</CardTitle>
                <XCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18%</div>
                <p className="text-xs text-muted-foreground">-3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Manual Review</CardTitle>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10%</div>
                <p className="text-xs text-muted-foreground">-2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.8 days</div>
                <p className="text-xs text-muted-foreground">-0.3 days from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Approval Distribution</CardTitle>
                <CardDescription>Distribution of approval decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={approvalStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {approvalStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approval Trends</CardTitle>
                <CardDescription>Monthly approval trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={approvalTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="approved" name="Approved" fill="#10b981" />
                      <Bar dataKey="rejected" name="Rejected" fill="#ef4444" />
                      <Bar dataKey="review" name="Manual Review" fill="#f59e0b" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Approval Metrics</CardTitle>
              <CardDescription>Key performance indicators for loan approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>Previous</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Approval Rate</TableCell>
                    <TableCell>72%</TableCell>
                    <TableCell>67%</TableCell>
                    <TableCell className="text-success">+5%</TableCell>
                    <TableCell>70%</TableCell>
                    <TableCell>
                      <Badge variant="success">Above Target</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Processing Time</TableCell>
                    <TableCell>1.8 days</TableCell>
                    <TableCell>2.1 days</TableCell>
                    <TableCell className="text-success">-0.3 days</TableCell>
                    <TableCell>2 days</TableCell>
                    <TableCell>
                      <Badge variant="success">Above Target</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">AI Accuracy</TableCell>
                    <TableCell>89%</TableCell>
                    <TableCell>86%</TableCell>
                    <TableCell className="text-success">+3%</TableCell>
                    <TableCell>90%</TableCell>
                    <TableCell>
                      <Badge variant="warning">Near Target</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Default Rate</TableCell>
                    <TableCell>3.2%</TableCell>
                    <TableCell>3.5%</TableCell>
                    <TableCell className="text-success">-0.3%</TableCell>
                    <TableCell>3.0%</TableCell>
                    <TableCell>
                      <Badge variant="warning">Near Target</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Customer Satisfaction</TableCell>
                    <TableCell>4.2/5</TableCell>
                    <TableCell>4.0/5</TableCell>
                    <TableCell className="text-success">+0.2</TableCell>
                    <TableCell>4.5/5</TableCell>
                    <TableCell>
                      <Badge variant="warning">Near Target</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                <BarChart className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review application {selectedApplication.id} for {selectedApplication.applicant}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Applicant</Label>
                  <div className="font-medium">{selectedApplication.applicant}</div>
                </div>
                <div className="space-y-2">
                  <Label>Application ID</Label>
                  <div className="font-medium">{selectedApplication.id}</div>
                </div>
                <div className="space-y-2">
                  <Label>Loan Amount</Label>
                  <div className="font-medium">${formatCurrency(selectedApplication.amount)}</div>
                </div>
                <div className="space-y-2">
                  <Label>Loan Term</Label>
                  <div className="font-medium">{selectedApplication.term} months</div>
                </div>
                <div className="space-y-2">
                  <Label>Purpose</Label>
                  <div className="font-medium">{selectedApplication.purpose}</div>
                </div>
                <div className="space-y-2">
                  <Label>Application Date</Label>
                  <div className="font-medium">{selectedApplication.date}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Risk Assessment</Label>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Risk Score</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{selectedApplication.score}/100</span>
                      <Badge
                        variant={
                          selectedApplication.score >= 70
                            ? "success"
                            : selectedApplication.score >= 60
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {selectedApplication.score >= 70
                          ? "Low Risk"
                          : selectedApplication.score >= 60
                            ? "Medium Risk"
                            : "High Risk"}
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={selectedApplication.score}
                    max={100}
                    className="h-2"
                    style={{
                      backgroundColor:
                        selectedApplication.score >= 70
                          ? "#10b981"
                          : selectedApplication.score >= 60
                            ? "#eab308"
                            : "#ef4444",
                    }}
                  />
                  <div className="mt-4">
                    <span className="font-medium">AI Recommendation:</span>
                    <Badge
                      className="ml-2"
                      variant={
                        selectedApplication.aiRecommendation === "approve"
                          ? "success"
                          : selectedApplication.aiRecommendation === "reject"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {selectedApplication.aiRecommendation === "approve" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {selectedApplication.aiRecommendation === "reject" && <XCircle className="mr-1 h-3 w-3" />}
                      {selectedApplication.aiRecommendation === "review" && <AlertTriangle className="mr-1 h-3 w-3" />}
                      {selectedApplication.aiRecommendation}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approval-note">Approval Note</Label>
                <Textarea
                  id="approval-note"
                  placeholder="Add notes about this approval decision..."
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="destructive" onClick={() => handleReject(selectedApplication)} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </>
                )}
              </Button>
              <Button onClick={() => handleApprove(selectedApplication)} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  )
}

