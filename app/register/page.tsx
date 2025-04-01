"use client"

import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"
import { CreditCard } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="inline-flex items-center">
            <CreditCard className="h-6 w-6 mr-2" />
            <span className="font-bold">BD Bank</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your details to create your account</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

