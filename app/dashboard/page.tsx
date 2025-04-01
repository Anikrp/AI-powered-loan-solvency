"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ApplicantDashboard } from "@/components/dashboard/applicant-dashboard"
import { OfficerDashboard } from "@/components/dashboard/officer-dashboard"
import { useAuth } from "@/components/auth/auth-context"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
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
      {user.role === "officer" ? <OfficerDashboard /> : <ApplicantDashboard userId={user.id} />}
    </DashboardLayout>
  )
}

