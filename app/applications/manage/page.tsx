"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ApplicationTable } from "@/components/loan/application-table"
import { getAllLoanApplications } from "@/lib/dummy-data"
import type { LoanApplication } from "@/types"
import { useAuth } from "@/components/auth/auth-context"

export default function ManageApplicationsPage() {
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

      if (user.role !== "officer") {
        router.push("/dashboard")
        return
      }

      // Fetch all applications for the officer
      const apps = getAllLoanApplications()
      setApplications(apps)
      setIsLoading(false)
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Applications</h1>
        <p className="text-muted-foreground">Review and process loan applications</p>
      </div>

      <ApplicationTable data={applications} userRole="officer" />
    </DashboardLayout>
  )
}

