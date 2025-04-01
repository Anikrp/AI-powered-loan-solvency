"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse stored user:", e)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<User | null> => {
    // For demo purposes, we'll accept any of our dummy users
    if (email === "john@example.com") {
      const user = {
        id: "2",
        name: "John Doe",
        email: "john@example.com",
        role: "applicant",
      }
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      return user
    } else if (email === "officer@bdbank.com") {
      const user = {
        id: "1",
        name: "Loan Officer",
        email: "officer@bdbank.com",
        role: "officer",
      }
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      return user
    }
    return null
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

