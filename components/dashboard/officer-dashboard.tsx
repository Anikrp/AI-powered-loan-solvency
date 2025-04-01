"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { LoanApplication } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { Calendar, Clock, FileText, Search, User } from "lucide-react"
import { getAllLoanApplications } from "@/lib/actions/loan-actions"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for charts
const applicationData = [
  { name: "Jan", applications: 10, approved: 6, rejected: 4 },
  { name: "Feb", applications: 12, approved: 8, rejected: 4 },
  { name: "Mar", applications: 15, approved: 10, rejected: 5 },
  { name: "Apr", applications: 18, approved: 12, rejected: 6 },
  { name: "May", applications: 20, approved: 14, rejected: 6 },
  { name: "Jun", applications: 22, approved: 16, rejected: 6 },
  { name: "Jul", applications: 25, approved: 18, rejected: 7 },
]

export function OfficerDashboard() {
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  })

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true)
      try {
        const apps = await getAllLoanApplications()
        setApplications(apps)

        // Calculate statistics
        const pending = apps.filter((app) => app.status === "submitted" || app.status === "under_review").length
        const approved = apps.filter((app) => app.status === "approved").length
        const rejected = apps.filter((app) => app.status === "rejected").length

        setStats({
          pending,
          approved,
          rejected,
          total: apps.length,
        })
      } catch (error) {
        console.error("Error fetching applications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const recentApplications = applications
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Officer Dashboard</h1>
        <p className="text-muted-foreground">Overview of all loan applications and analytics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 10)}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">{stats.pending} applications need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.approved / stats.total) * 100)}% approval rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.rejected / stats.total) * 100)}% rejection rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Application Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                applications: {
                  label: "Applications",
                  color: "hsl(var(--primary))",
                },
                approved: {
                  label: "Approved",
                  color: "hsl(var(--success))",
                },
                rejected: {
                  label: "Rejected",
                  color: "hsl(var(--destructive))",
                },
              }}
              className="aspect-auto h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={applicationData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => value}
                    className="text-xs"
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="var(--color-applications)"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Line type="monotone" dataKey="approved" stroke="var(--color-approved)" strokeWidth={2} />
                  <Line type="monotone" dataKey="rejected" stroke="var(--color-rejected)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Last {recentApplications.length} applications received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none">{app.applicantName}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      ${formatCurrency(app.loanAmount)} - {app.loanPurpose}
                    </p>
                  </div>
                  <Badge
                    variant={
                      app.status === "approved" ? "success" : app.status === "rejected" ? "destructive" : "secondary"
                    }
                  >
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/applications/manage">
                <Search className="mr-2 h-4 w-4" />
                View All Applications
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

