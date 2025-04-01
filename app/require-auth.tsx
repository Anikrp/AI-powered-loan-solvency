"use server"

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { UserRole } from "@/types"

export async function requireAuth(requiredRole?: UserRole) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (requiredRole && session.user.role !== requiredRole) {
    redirect("/dashboard")
  }

  return session
}

