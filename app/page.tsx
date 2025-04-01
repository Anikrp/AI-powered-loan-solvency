import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreditCard, Shield, CheckCircle, BarChart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10 items-center">
            <CreditCard className="h-6 w-6" />
            <span className="font-bold">BD Bank</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  AI-Powered Loan Assessment System
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Streamlined loan applications with intelligent risk assessment and automated approvals.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Shield className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Secure & Compliant</h2>
                  <p className="text-muted-foreground">
                    Our system ensures KYC/AML compliance with secure document storage and encryption.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Automated Approvals</h2>
                  <p className="text-muted-foreground">
                    AI-powered risk scoring and document verification for fast and accurate loan approvals.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BarChart className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Advanced Analytics</h2>
                  <p className="text-muted-foreground">
                    Comprehensive dashboard with loan statistics, risk reports, and approval trends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BD Bank. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

