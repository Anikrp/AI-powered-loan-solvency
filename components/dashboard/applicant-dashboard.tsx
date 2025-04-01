"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { LoanApplication } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Info,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  AlertTriangle,
  Landmark,
  ArrowRight,
  Calendar,
  DollarSign,
  BriefcaseBusiness,
} from "lucide-react"
import { getLoanApplicationsByUser } from "@/lib/dummy-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ApplicantDashboardProps {
  userId: string
}

const statusIcons = {
  draft: <FileText className="h-4 w-4" />,
  submitted: <Clock className="h-4 w-4" />,
  under_review: <AlertTriangle className="h-4 w-4" />,
  approved: <CheckCircle className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
}

const statusLabels = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
}

const statusColors = {
  draft: "secondary",
  submitted: "warning",
  under_review: "default",
  approved: "success",
  rejected: "destructive",
} as const

// Mock loan offers for quick application
const loanOffers = [
  {
    id: "offer1",
    name: "Personal Loan",
    icon: <DollarSign className="h-5 w-5" />,
    amount: "Up to $50,000",
    term: "12-60 months",
    rate: "From 8.99%",
    description: "Flexible funding for personal expenses, debt consolidation, or unexpected costs.",
  },
  {
    id: "offer2",
    name: "Home Loan",
    icon: <Landmark className="h-5 w-5" />,
    amount: "Up to $500,000",
    term: "Up to 30 years",
    rate: "From 6.75%",
    description: "Finance your dream home or renovate your current one with competitive rates.",
  },
  {
    id: "offer3",
    name: "Business Loan",
    icon: <BriefcaseBusiness className="h-5 w-5" />,
    amount: "Up to $200,000",
    term: "12-84 months",
    rate: "From 10.5%",
    description: "Capital to grow your business, upgrade equipment, or manage cash flow.",
  },
]

// Mock upcoming payments data
const upcomingPayments = [
  {
    id: "payment1",
    loanId: "L-10234",
    amount: 856.45,
    dueDate: "2023-07-15",
    status: "upcoming",
    type: "Personal Loan",
  },
  {
    id: "payment2",
    loanId: "L-10235",
    amount: 1256.78,
    dueDate: "2023-07-22",
    status: "upcoming",
    type: "Home Loan",
  },
]

export function ApplicantDashboard({ userId }: ApplicantDashboardProps) {
  const router = useRouter()
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true)
      try {
        const apps = await getLoanApplicationsByUser(userId)
        setApplications(apps)
      } catch (error) {
        console.error("Error fetching applications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading your applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">View your loan applications and manage your account.</p>
        </div>
        <Button asChild>
          <Link href="/applications/new">
            <CreditCard className="mr-2 h-4 w-4" />
            Apply for a Loan
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <Landmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{applications.filter((a) => a.status === "approved").length}</div>
                <p className="text-xs text-muted-foreground">
                  {applications.filter((a) => a.status === "approved").length === 0
                    ? "No active loans"
                    : `${applications.filter((a) => a.status === "approved").length} loans in good standing`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {applications.filter((a) => a.status === "submitted" || a.status === "under_review").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {applications.filter((a) => a.status === "submitted" || a.status === "under_review").length === 0
                    ? "No pending applications"
                    : "Applications awaiting decision"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {formatCurrency(
                    applications.filter((a) => a.status === "approved").reduce((sum, app) => sum + app.loanAmount, 0),
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Across all approved loans</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-semibold mt-6">Quick Apply</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {loanOffers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {offer.icon}
                    </div>
                    <CardTitle>{offer.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium">{offer.amount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Term</p>
                      <p className="font-medium">{offer.term}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Rate</p>
                      <p className="font-medium">{offer.rate}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{offer.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/applications/new">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {applications.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-6">Recent Applications</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {applications.slice(0, 3).map((application) => (
                  <Card key={application.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">${formatCurrency(application.loanAmount)}</CardTitle>
                        <Badge variant={statusColors[application.status]}>
                          <span className="flex items-center gap-1">
                            {statusIcons[application.status]}
                            {statusLabels[application.status]}
                          </span>
                        </Badge>
                      </div>
                      <CardDescription>{application.loanPurpose}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Loan Term</span>
                            <span>{application.loanTerm} months</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Application Date</span>
                            <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                          </div>
                          {application.riskScore !== undefined && (
                            <div className="pt-2">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Risk Score</span>
                                <span>{application.riskScore}/100</span>
                              </div>
                              <Progress value={application.riskScore} max={100} />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/applications/${application.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Applications Yet</CardTitle>
                <CardDescription>You haven't submitted any loan applications yet.</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Get started</AlertTitle>
                  <AlertDescription>Click on "Apply for a Loan" to start your first application.</AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/applications/new">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Apply for a Loan
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your Applications</CardTitle>
                <CardDescription>All your loan applications and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{application.loanPurpose}</span>
                          <Badge variant={statusColors[application.status]}>{statusLabels[application.status]}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex gap-4">
                          <span>${formatCurrency(application.loanAmount)}</span>
                          <span>•</span>
                          <span>{application.loanTerm} months</span>
                          <span>•</span>
                          <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/applications/${application.id}`}>View Details</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/applications/new">
                    <CreditCard className="mr-2 h-4 w-4" />
                    New Application
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payments</CardTitle>
              <CardDescription>Your scheduled loan payments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingPayments.length === 0 ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>No Upcoming Payments</AlertTitle>
                  <AlertDescription>You don't have any upcoming loan payments scheduled.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {upcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{payment.type} Payment</div>
                        <div className="text-sm text-muted-foreground flex gap-4">
                          <span>Loan ID: {payment.loanId}</span>
                          <span>•</span>
                          <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-bold">${formatCurrency(payment.amount)}</div>
                        <Button size="sm">Pay Now</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View Payment Schedule
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Record of your past loan payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Payment History</AlertTitle>
                <AlertDescription>
                  Your payment history will appear here once you've made payments on your loans.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

