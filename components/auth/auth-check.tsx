"use client"

import { useAuth } from "@/components/auth/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

interface AuthCheckProps {
  children: ReactNode
  requiredRole?: string
}

export function AuthCheck({ children, requiredRole }: AuthCheckProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && requiredRole && user?.role !== requiredRole) {
      router.push("/dashboard")
      return
    }
  }, [loading, user, router, requiredRole])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}

