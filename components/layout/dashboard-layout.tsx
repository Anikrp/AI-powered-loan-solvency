"use client"

import type React from "react"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Settings,
  UserIcon,
  Menu,
  CheckCircle,
  AlertTriangle,
  DollarSign,
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: string
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const { user } = useAuth()

  // Use user from auth context if available, otherwise use the passed userRole
  const displayUser = user || {
    id: userRole === "officer" ? "1" : "2",
    name: userRole === "officer" ? "Loan Officer" : "John Doe",
    email: userRole === "officer" ? "officer@bdbank.com" : "john@example.com",
    role: userRole,
  }

  return (
    <SidebarProvider>
      <DashboardSidebar user={displayUser} />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <UserNav user={displayUser} />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname()

  const navItemsApplicant = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "My Applications",
      href: "/applications",
      icon: FileText,
    },
    {
      title: "Apply for Loan",
      href: "/applications/new",
      icon: CreditCard,
    },
    {
      title: "Payments",
      href: "/payments",
      icon: DollarSign,
    },
    {
      title: "Finances",
      href: "/finances",
      icon: BarChart3,
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: Bell,
    },
    {
      title: "Support",
      href: "/support",
      icon: HelpCircle,
    },
  ]

  const navItemsOfficer = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Applications",
      href: "/applications/manage",
      icon: FileText,
    },
    {
      title: "Risk Assessment",
      href: "/risk-assessment",
      icon: AlertTriangle,
    },
    {
      title: "Approvals",
      href: "/approvals",
      icon: CheckCircle,
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3,
    },
  ]

  const navItems = user.role === "officer" ? navItemsOfficer : navItemsApplicant

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <CreditCard className="h-6 w-6" />
          <span>BD Bank</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt={user.name || ""} />
            <AvatarFallback>
              {user.name
                ? user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5 text-xs">
            <div className="font-medium">{user.name}</div>
            <div className="text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function UserNav({ user }: { user: any }) {
  const { logout } = useAuth()
  const router = useRouter()

  const handleSignOut = () => {
    logout()
    router.push("/")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={user.name || ""} />
            <AvatarFallback>
              {user.name
                ? user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

