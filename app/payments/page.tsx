"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, FileText, CreditCard, CheckCircle, Clock } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for payments
const upcomingPayments = [
  {
    id: "payment1",
    loanId: "L-10234",
    amount: 856.45,
    dueDate: "2023-07-15",
    status: "scheduled",
    type: "Personal Loan",
  },
  {
    id: "payment2",
    loanId: "L-10235",
    amount: 1256.78,
    dueDate: "2023-07-22",
    status: "scheduled",
    type: "Home Loan",
  },
  {
    id: "payment3",
    loanId: "L-10234",
    amount: 856.45,
    dueDate: "2023-08-15",
    status: "scheduled",
    type: "Personal Loan",
  },
]

const pastPayments = [
  {
    id: "payment4",
    loanId: "L-10234",
    amount: 856.45,
    dueDate: "2023-06-15",
    status: "completed",
    paidDate: "2023-06-15",
    type: "Personal Loan",
  },
  {
    id: "payment5",
    loanId: "L-10235",
    amount: 1256.78,
    dueDate: "2023-06-22",
    status: "completed",
    paidDate: "2023-06-21",
    type: "Home Loan",
  },
  {
    id: "payment6",
    loanId: "L-10234",
    amount: 856.45,
    dueDate: "2023-05-15",
    status: "completed",
    paidDate: "2023-05-15",
    type: "Personal Loan",
  },
  {
    id: "payment7",
    loanId: "L-10235",
    amount: 1256.78,
    dueDate: "2023-05-22",
    status: "completed",
    paidDate: "2023-05-20",
    type: "Home Loan",
  },
]

export default function PaymentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upcoming")

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
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Manage your loan payments and payment schedule</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="schedule">Payment Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payments</CardTitle>
              <CardDescription>Your scheduled loan payments due in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingPayments
                    .filter((p) => new Date(p.dueDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000)
                    .map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="font-medium">{payment.type}</div>
                          <div className="text-sm text-muted-foreground">ID: {payment.loanId}</div>
                        </TableCell>
                        <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>${formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Clock className="mr-1 h-3 w-3" />
                            Scheduled
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm">Pay Now</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Set Up Auto Pay
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Record of your past loan payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="font-medium">{payment.type}</div>
                        <div className="text-sm text-muted-foreground">ID: {payment.loanId}</div>
                      </TableCell>
                      <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(payment.paidDate).toLocaleDateString()}</TableCell>
                      <TableCell>${formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="success">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Download Payment History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Schedule</CardTitle>
              <CardDescription>Your complete loan payment schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...upcomingPayments, ...pastPayments]
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map((payment) => {
                      // Mock principal and interest calculation (70% principal, 30% interest)
                      const principal = payment.amount * 0.7
                      const interest = payment.amount * 0.3

                      return (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div className="font-medium">{payment.type}</div>
                            <div className="text-sm text-muted-foreground">ID: {payment.loanId}</div>
                          </TableCell>
                          <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>${formatCurrency(payment.amount)}</TableCell>
                          <TableCell>${formatCurrency(principal)}</TableCell>
                          <TableCell>${formatCurrency(interest)}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === "completed" ? "success" : "outline"}>
                              {payment.status === "completed" ? (
                                <>
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Completed
                                </>
                              ) : (
                                <>
                                  <Clock className="mr-1 h-3 w-3" />
                                  Scheduled
                                </>
                              )}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                Make Extra Payment
              </Button>
              <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Update Payment Method
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

