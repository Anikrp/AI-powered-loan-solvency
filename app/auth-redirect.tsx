"use server"

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getSessionAndRedirect() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return null
}
[]
sd