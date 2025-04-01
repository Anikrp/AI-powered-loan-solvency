"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoanApplicationForm } from "@/components/loan/loan-application-form"
import { useAuth } from "@/components/auth/auth-context"

export default function NewApplicationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (user.role !== "applicant") {
        router.push("/dashboard")
        return
      }
    }
  }, [loading, user, router])

  if (loading) {
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
        <h1 className="text-3xl font-bold tracking-tight">Apply for a Loan</h1>
        <p className="text-muted-foreground">Fill out the form below to apply for a loan</p>
      </div>

      <LoanApplicationForm userId={user.id} />
    </DashboardLayout>
  )
}

