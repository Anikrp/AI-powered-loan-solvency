"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-context"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  LineChart,
  PieChart,
  ResponsiveContainer,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Pie,
  Cell,
} from "recharts"
import { DollarSign, CreditCard, BarChartIcon, Info, Download, Calendar, TrendingUp } from "lucide-react"

// Mock data for financial overview
const incomeExpenseData = [
  { month: "Jan", income: 6500, expenses: 4200 },
  { month: "Feb", income: 6500, expenses: 4800 },
  { month: "Mar", income: 6700, expenses: 5100 },
  { month: "Apr", income: 6800, expenses: 4300 },
  { month: "May", income: 6500, expenses: 4600 },
  { month: "Jun", income: 7200, expenses: 5000 },
]

const debtBreakdown = [
  { name: "Home Loan", value: 240000, color: "#8884d8" },
  { name: "Car Loan", value: 18000, color: "#82ca9d" },
  { name: "Personal Loan", value: 12000, color: "#ffc658" },
  { name: "Credit Cards", value: 5000, color: "#ff8042" },
]

const creditScoreHistory = [
  { month: "Jan", score: 680 },
  { month: "Feb", score: 685 },
  { month: "Mar", score: 690 },
  { month: "Apr", score: 700 },
  { month: "May", score: 715 },
  { month: "Jun", score: 720 },
]

export default function FinancesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user?.role !== "applicant") {
      router.push("/dashboard")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user || user.role !== "applicant") {
    return null
  }

  return (
    <DashboardLayout userRole={user.role}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
        <p className="text-muted-foreground">Manage your finances and view your financial health</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income & Expenses</TabsTrigger>
          <TabsTrigger value="debt">Debt Overview</TabsTrigger>
          <TabsTrigger value="credit">Credit Score</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${formatCurrency(6800)}</div>
                <p className="text-xs text-muted-foreground">+$300 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${formatCurrency(4300)}</div>
                <p className="text-xs text-muted-foreground">-$500 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
                <BarChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${formatCurrency(275000)}</div>
                <p className="text-xs text-muted-foreground">Across all loans</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">720</div>
                <p className="text-xs text-muted-foreground">+5 points from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Health Summary</CardTitle>
              <CardDescription>Overview of your financial metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Debt-to-Income Ratio</span>
                    <span className="text-sm font-medium">36%</span>
                  </div>
                  <Progress value={36} max={100} className="h-2" />
                  <p className="text-xs text-muted-foreground">A DTI ratio under 43% is generally considered good.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Emergency Fund</span>
                    <span className="text-sm font-medium">$12,000 (3 months)</span>
                  </div>
                  <Progress value={75} max={100} className="h-2" />
                  <p className="text-xs text-muted-foreground">Aim for 3-6 months of expenses in savings.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Savings Rate</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <Progress value={18} max={50} className="h-2" />
                  <p className="text-xs text-muted-foreground">Financial experts recommend saving 15-20% of income.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Financial Report
              </Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Income vs. Expenses</CardTitle>
                <CardDescription>Monthly comparison for the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={incomeExpenseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${formatCurrency(value as number)}`} />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#8884d8" name="Income" />
                      <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Debt Breakdown</CardTitle>
                <CardDescription>Distribution of your current debts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={debtBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {debtBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${formatCurrency(value as number)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="income" className="space-y-4 mt-6">
          {/* Income and Expenses tab content - will be implemented as needed */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Income and Expenses Details</AlertTitle>
            <AlertDescription>
              This section will provide detailed breakdown of your income sources and expense categories.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="debt" className="space-y-4 mt-6">
          {/* Debt Overview tab content - will be implemented as needed */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Debt Management Tools</AlertTitle>
            <AlertDescription>
              This section will provide tools and insights to help you manage and reduce your debts.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="credit" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Credit Score History</CardTitle>
              <CardDescription>Your credit score over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={creditScoreHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[650, 850]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" name="Credit Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Credit Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

