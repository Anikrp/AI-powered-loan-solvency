"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-context"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
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
  Area,
  AreaChart,
  ComposedChart,
} from "recharts"
import {
  Download,
  FileText,
  Calendar,
  RefreshCw,
  Share2,
  Printer,
  Clock,
  DollarSign,
  Users,
  TrendingDown,
} from "lucide-react"

// Mock data for loan performance
const loanPerformance = [
  { month: "Jan", disbursed: 1250000, repaid: 980000, defaulted: 45000 },
  { month: "Feb", disbursed: 1320000, repaid: 1050000, defaulted: 48000 },
  { month: "Mar", disbursed: 1450000, repaid: 1120000, defaulted: 52000 },
  { month: "Apr", disbursed: 1380000, repaid: 1180000, defaulted: 41000 },
  { month: "May", disbursed: 1520000, repaid: 1250000, defaulted: 39000 },
  { month: "Jun", disbursed: 1680000, repaid: 1320000, defaulted: 43000 },
]

// Mock data for loan types
const loanTypeDistribution = [
  { name: "Personal Loan", value: 45, color: "#8884d8" },
  { name: "Home Loan", value: 30, color: "#82ca9d" },
  { name: "Business Loan", value: 15, color: "#ffc658" },
  { name: "Auto Loan", value: 10, color: "#ff8042" },
]

// Mock data for risk distribution
const riskDistribution = [
  { name: "Low Risk", value: 55, color: "#10b981" },
  { name: "Medium Risk", value: 30, color: "#f59e0b" },
  { name: "High Risk", value: 15, color: "#ef4444" },
]

// Mock data for customer demographics
const customerDemographics = [
  { age: "18-24", count: 120, avgLoan: 15000 },
  { age: "25-34", count: 350, avgLoan: 35000 },
  { age: "35-44", count: 280, avgLoan: 65000 },
  { age: "45-54", count: 190, avgLoan: 85000 },
  { age: "55-64", count: 140, avgLoan: 55000 },
  { age: "65+", count: 90, avgLoan: 25000 },
]

// Mock data for loan officer performance
const officerPerformance = [
  { name: "Jane Smith", processed: 45, approved: 32, rejected: 13, avgProcessingTime: 1.2 },
  { name: "John Davis", processed: 38, approved: 29, rejected: 9, avgProcessingTime: 1.5 },
  { name: "Sarah Johnson", processed: 52, approved: 41, rejected: 11, avgProcessingTime: 0.9 },
  { name: "Michael Brown", processed: 33, approved: 22, rejected: 11, avgProcessingTime: 1.8 },
  { name: "Emily Wilson", processed: 41, approved: 35, rejected: 6, avgProcessingTime: 1.1 },
]

export default function ReportsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("last30days")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [reportFormat, setReportFormat] = useState("pdf")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user?.role !== "officer") {
      router.push("/dashboard")
    }
  }, [loading, user, router])

  const handleGenerateReport = () => {
    setIsGeneratingReport(true)
    // Simulate API call
    setTimeout(() => {
      setIsGeneratingReport(false)
      toast({
        title: "Report generated",
        description: `Your ${reportFormat.toUpperCase()} report has been generated successfully.`,
      })
    }, 2000)
  }

  const handleExportData = (format: string) => {
    toast({
      title: `Data exported as ${format.toUpperCase()}`,
      description: "The report data has been exported successfully.",
    })
  }

  const handleShareReport = () => {
    toast({
      title: "Report shared",
      description: "The report has been shared via email.",
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
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">View and generate loan reports and analytics</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Loan Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
          <TabsTrigger value="officers">Officer Performance</TabsTrigger>
        </TabsList>

        <div className="flex items-center justify-between mt-6 mb-4">
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last90days">Last 90 Days</SelectItem>
                <SelectItem value="lastyear">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange === "last7days"
                ? "Last 7 Days"
                : dateRange === "last30days"
                  ? "Last 30 Days"
                  : dateRange === "last90days"
                    ? "Last 90 Days"
                    : dateRange === "lastyear"
                      ? "Last Year"
                      : "Custom Range"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select value={reportFormat} onValueChange={setReportFormat}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
              {isGeneratingReport ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${formatCurrency(8450000)}</div>
                <p className="text-xs text-muted-foreground">+12% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Active Borrowers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground">+8% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Default Rate</CardTitle>
                <TrendingDown className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">-0.5% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.8 days</div>
                <p className="text-xs text-muted-foreground">-0.3 days from last period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Loan Performance</CardTitle>
                <CardDescription>Disbursed vs. Repaid vs. Defaulted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={loanPerformance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${formatCurrency(value as number)}`} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="disbursed"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        name="Disbursed"
                      />
                      <Area
                        type="monotone"
                        dataKey="repaid"
                        stackId="2"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        name="Repaid"
                      />
                      <Area
                        type="monotone"
                        dataKey="defaulted"
                        stackId="3"
                        stroke="#ffc658"
                        fill="#ffc658"
                        name="Defaulted"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Type Distribution</CardTitle>
                <CardDescription>Distribution by loan type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={loanTypeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {loanTypeDistribution.map((entry, index) => (
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
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Loan Summary</CardTitle>
              <CardDescription>Summary of recent loan activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan Type</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Number of Loans</TableHead>
                    <TableHead>Avg. Interest Rate</TableHead>
                    <TableHead>Avg. Term</TableHead>
                    <TableHead>Default Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Personal Loan</TableCell>
                    <TableCell>${formatCurrency(3800000)}</TableCell>
                    <TableCell>425</TableCell>
                    <TableCell>9.5%</TableCell>
                    <TableCell>36 months</TableCell>
                    <TableCell>3.8%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Home Loan</TableCell>
                    <TableCell>${formatCurrency(2540000)}</TableCell>
                    <TableCell>185</TableCell>
                    <TableCell>7.2%</TableCell>
                    <TableCell>240 months</TableCell>
                    <TableCell>1.2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Business Loan</TableCell>
                    <TableCell>${formatCurrency(1270000)}</TableCell>
                    <TableCell>95</TableCell>
                    <TableCell>11.5%</TableCell>
                    <TableCell>48 months</TableCell>
                    <TableCell>5.6%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Auto Loan</TableCell>
                    <TableCell>${formatCurrency(840000)}</TableCell>
                    <TableCell>120</TableCell>
                    <TableCell>8.3%</TableCell>
                    <TableCell>60 months</TableCell>
                    <TableCell>2.9%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Data for period:{" "}
                {dateRange === "last7days"
                  ? "Last 7 Days"
                  : dateRange === "last30days"
                    ? "Last 30 Days"
                    : dateRange === "last90days"
                      ? "Last 90 Days"
                      : dateRange === "lastyear"
                        ? "Last Year"
                        : "Custom Range"}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExportData("csv")}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportData("excel")}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators for loan portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={loanPerformance} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="month" scale="band" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip formatter={(value) => `$${formatCurrency(value as number)}`} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="disbursed" barSize={20} fill="#8884d8" name="Disbursed" />
                    <Bar yAxisId="left" dataKey="repaid" barSize={20} fill="#82ca9d" name="Repaid" />
                    <Line yAxisId="right" type="monotone" dataKey="defaulted" stroke="#ff7300" name="Defaulted" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="outline" size="sm" onClick={() => handleShareReport()}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportData("pdf")}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Repayment Rate</CardTitle>
                <CardDescription>Monthly repayment rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={loanPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="repaid" stroke="#82ca9d" name="Repaid" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Default Rate</CardTitle>
                <CardDescription>Monthly default rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={loanPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="defaulted" stroke="#ff7300" name="Defaulted" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disbursement</CardTitle>
                <CardDescription>Monthly loan disbursement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={loanPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="disbursed" stroke="#8884d8" name="Disbursed" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Distribution of loans by risk level</CardDescription>
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
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Factors</CardTitle>
                <CardDescription>Key risk factors affecting loan portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Credit Score</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <Progress value={35} max={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Debt-to-Income Ratio</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <Progress value={25} max={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Loan-to-Income Ratio</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <Progress value={20} max={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Employment Stability</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <Progress value={10} max={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Payment History</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <Progress value={10} max={100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Accuracy</CardTitle>
              <CardDescription>AI model accuracy in risk prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Risk Model</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>False Positives</TableHead>
                    <TableHead>False Negatives</TableHead>
                    <TableHead>Precision</TableHead>
                    <TableHead>Recall</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Credit Score Model</TableCell>
                    <TableCell>87%</TableCell>
                    <TableCell>8.2%</TableCell>
                    <TableCell>4.8%</TableCell>
                    <TableCell>91.8%</TableCell>
                    <TableCell>95.2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Income Verification Model</TableCell>
                    <TableCell>92%</TableCell>
                    <TableCell>4.5%</TableCell>
                    <TableCell>3.5%</TableCell>
                    <TableCell>95.5%</TableCell>
                    <TableCell>96.5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fraud Detection Model</TableCell>
                    <TableCell>78%</TableCell>
                    <TableCell>12.3%</TableCell>
                    <TableCell>9.7%</TableCell>
                    <TableCell>87.7%</TableCell>
                    <TableCell>90.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Document Verification Model</TableCell>
                    <TableCell>85%</TableCell>
                    <TableCell>9.8%</TableCell>
                    <TableCell>5.2%</TableCell>
                    <TableCell>90.2%</TableCell>
                    <TableCell>94.8%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>Age distribution of borrowers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customerDemographics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Number of Customers" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Loan Amount by Age Group</CardTitle>
                <CardDescription>Average loan amount by customer age group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customerDemographics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${formatCurrency(value as number)}`} />
                      <Legend />
                      <Bar dataKey="avgLoan" name="Average Loan Amount" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Acquisition and Retention</CardTitle>
              <CardDescription>New vs. returning customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="newCustomers" name="New Customers" stroke="#8884d8" />
                    <Line type="monotone" dataKey="returningCustomers" name="Returning Customers" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="officers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Officer Performance</CardTitle>
              <CardDescription>Performance metrics for loan officers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Officer Name</TableHead>
                    <TableHead>Applications Processed</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Rejected</TableHead>
                    <TableHead>Approval Rate</TableHead>
                    <TableHead>Avg. Processing Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {officerPerformance.map((officer) => (
                    <TableRow key={officer.name}>
                      <TableCell className="font-medium">{officer.name}</TableCell>
                      <TableCell>{officer.processed}</TableCell>
                      <TableCell>{officer.approved}</TableCell>
                      <TableCell>{officer.rejected}</TableCell>
                      <TableCell>{Math.round((officer.approved / officer.processed) * 100)}%</TableCell>
                      <TableCell>{officer.avgProcessingTime} days</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Applications Processed</CardTitle>
                <CardDescription>Number of applications processed by officer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={officerPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="processed" name="Applications Processed" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approval vs. Rejection</CardTitle>
                <CardDescription>Approval and rejection rates by officer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={officerPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="approved" name="Approved" fill="#82ca9d" />
                      <Bar dataKey="rejected" name="Rejected" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

