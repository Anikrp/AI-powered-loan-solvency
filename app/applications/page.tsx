"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ApplicationTable } from "@/components/loan/application-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getLoanApplicationsByUser } from "@/lib/dummy-data"
import type { LoanApplication } from "@/types"
import { useAuth } from "@/components/auth/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function ApplicationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (user.role === "officer") {
        router.push("/applications/manage")
        return
      }

      // Fetch applications for the current user
      const fetchApplications = async () => {
        try {
          const apps = await getLoanApplicationsByUser(user.id)
          setApplications(apps)
        } catch (error) {
          console.error("Error fetching applications:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchApplications()
    }
  }, [loading, user, router])

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout userRole={user.role}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground">View and manage your loan applications</p>
        </div>
        <Button asChild>
          <Link href="/applications/new">
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Link>
        </Button>
      </div>

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
        </Card>
      ) : (
        <ApplicationTable data={applications} userRole="applicant" />
      )}
    </DashboardLayout>
  )
}

