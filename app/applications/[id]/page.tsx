"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ApplicationDetail } from "@/components/loan/application-detail"
import { getLoanApplicationById } from "@/lib/dummy-data"
import type { LoanApplication } from "@/types"
import { useAuth } from "@/components/auth/auth-context"

export default function ApplicationDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [application, setApplication] = useState<LoanApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (params.id) {
        const app = getLoanApplicationById(params.id as string)

        if (!app) {
          router.push("/not-found")
          return
        }

        // Check if user is authorized to view this application
        if (user.role !== "officer" && app.userId !== user.id) {
          router.push("/dashboard")
          return
        }

        setApplication(app)
        setIsLoading(false)
      }
    }
  }, [loading, user, router, params.id])

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user || !application) {
    return null
  }

  return (
    <DashboardLayout userRole={user.role}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Application Details</h1>
        <p className="text-muted-foreground">View the details of your loan application</p>
      </div>

      <ApplicationDetail application={application} />
    </DashboardLayout>
  )
}

