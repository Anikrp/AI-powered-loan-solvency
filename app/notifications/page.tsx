"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-context"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, CheckCircle, Clock, FileText, Settings, Trash2 } from "lucide-react"

// Mock notifications data
const notifications = [
  {
    id: "notif1",
    title: "Application Submitted",
    message: "Your loan application #APP-1234 has been successfully submitted.",
    date: "2023-06-15T10:30:00",
    read: true,
    type: "application",
  },
  {
    id: "notif2",
    title: "Application Under Review",
    message: "Your loan application #APP-1234 is now under review by our team.",
    date: "2023-06-16T14:45:00",
    read: true,
    type: "application",
  },
  {
    id: "notif3",
    title: "Document Verification",
    message: "Your documents have been verified successfully.",
    date: "2023-06-17T09:15:00",
    read: false,
    type: "document",
  },
  {
    id: "notif4",
    title: "Payment Due Reminder",
    message: "Your loan payment of $856.45 is due in 3 days.",
    date: "2023-06-20T08:00:00",
    read: false,
    type: "payment",
  },
  {
    id: "notif5",
    title: "Application Approved",
    message: "Congratulations! Your loan application #APP-1234 has been approved.",
    date: "2023-06-21T16:30:00",
    read: false,
    type: "application",
  },
]

export default function NotificationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [userNotifications, setUserNotifications] = useState(notifications)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }
  }, [loading, user, router])

  const markAsRead = (id: string) => {
    setUserNotifications(userNotifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setUserNotifications(userNotifications.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setUserNotifications(userNotifications.filter((notif) => notif.id !== id))
  }

  const filteredNotifications =
    activeTab === "all"
      ? userNotifications
      : activeTab === "unread"
        ? userNotifications.filter((notif) => !notif.read)
        : userNotifications.filter((notif) => notif.type === activeTab)

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
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Manage your notifications and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="application">Applications</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
          </TabsList>
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "all"
                  ? "All Notifications"
                  : activeTab === "unread"
                    ? "Unread Notifications"
                    : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications`}
              </CardTitle>
              <CardDescription>
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <p className="mt-4 text-lg font-medium">No notifications</p>
                    <p className="text-sm text-muted-foreground">
                      You don't have any {activeTab !== "all" ? `${activeTab} ` : ""}notifications at the moment.
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start justify-between p-4 border rounded-lg ${!notification.read ? "bg-primary/5" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {notification.type === "application" && <FileText className="h-5 w-5 text-primary" />}
                          {notification.type === "payment" && <Clock className="h-5 w-5 text-warning" />}
                          {notification.type === "document" && <CheckCircle className="h-5 w-5 text-success" />}
                        </div>
                        <div>
                          <div className="font-medium">{notification.title}</div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                            Mark as Read
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifs">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch id="email-notifs" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="app-updates">Application Updates</Label>
                <p className="text-sm text-muted-foreground">Notifications about your loan applications</p>
              </div>
              <Switch id="app-updates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payment-reminders">Payment Reminders</Label>
                <p className="text-sm text-muted-foreground">Reminders about upcoming loan payments</p>
              </div>
              <Switch id="payment-reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="document-updates">Document Updates</Label>
                <p className="text-sm text-muted-foreground">Notifications about document verification</p>
              </div>
              <Switch id="document-updates" defaultChecked />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Advanced Settings
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  )
}

