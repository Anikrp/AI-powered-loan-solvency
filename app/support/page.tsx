"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-context"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MessageSquare, Phone, Mail, FileText, CheckCircle, Info } from "lucide-react"

export default function SupportPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("faq")
  const [searchQuery, setSearchQuery] = useState("")
  const [messageSubmitted, setMessageSubmitted] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }
  }, [loading, user, router])

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate message submission
    setTimeout(() => {
      setMessageSubmitted(true)
    }, 1000)
  }

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
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">Get help with your account and loan applications</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about our loan services</CardDescription>
              <div className="mt-4">
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I apply for a loan?</AccordionTrigger>
                  <AccordionContent>
                    To apply for a loan, navigate to the "Apply for Loan" section in your dashboard. Fill out the
                    application form with your personal and financial information, upload the required documents, and
                    submit your application. You can track the status of your application in the "My Applications"
                    section.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What documents do I need to provide?</AccordionTrigger>
                  <AccordionContent>
                    The required documents vary depending on the type of loan you're applying for. Generally, you'll
                    need to provide identification (such as a driver's license or passport), proof of income (pay stubs,
                    tax returns), bank statements, and possibly additional documents specific to your loan type. The
                    application form will specify exactly what documents are needed.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How long does the approval process take?</AccordionTrigger>
                  <AccordionContent>
                    The approval process typically takes 1-3 business days for personal loans, and 5-7 business days for
                    larger loans such as home or business loans. However, this timeline can vary based on the
                    completeness of your application, the verification of your documents, and other factors. You can
                    check the status of your application in real-time through your dashboard.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How is my interest rate determined?</AccordionTrigger>
                  <AccordionContent>
                    Your interest rate is determined based on several factors, including your credit score, income,
                    debt-to-income ratio, loan amount, loan term, and the type of loan you're applying for. Our
                    AI-powered risk assessment system evaluates these factors to offer you the most competitive rate
                    possible while ensuring responsible lending practices.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Can I pay off my loan early?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can pay off your loan early without any prepayment penalties. You can make extra payments
                    or pay off the entire balance at any time through the "Payments" section of your dashboard. Early
                    repayment can save you money on interest over the life of the loan.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>What happens if I miss a payment?</AccordionTrigger>
                  <AccordionContent>
                    If you miss a payment, you may be charged a late fee, and it could negatively impact your credit
                    score. We understand that financial difficulties can arise, so we encourage you to contact our
                    support team as soon as possible if you anticipate having trouble making a payment. We may be able
                    to work out a payment plan or other arrangement to help you stay on track.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Our Support Team</CardTitle>
              <CardDescription>We're here to help with any questions or concerns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone Support</h3>
                      <p className="text-sm text-muted-foreground">Call us at (555) 123-4567</p>
                      <p className="text-sm text-muted-foreground">Monday-Friday, 9am-5pm EST</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Support</h3>
                      <p className="text-sm text-muted-foreground">support@bdbank.com</p>
                      <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Live Chat</h3>
                      <p className="text-sm text-muted-foreground">Chat with our support team</p>
                      <p className="text-sm text-muted-foreground">Available 24/7</p>
                    </div>
                  </div>
                </div>

                <div>
                  {messageSubmitted ? (
                    <Alert variant="success" className="mb-4">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Message Sent</AlertTitle>
                      <AlertDescription>
                        Thank you for contacting us. We'll respond to your message within 24 hours.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handleSubmitMessage} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue={user.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="How can we help you?" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Please describe your issue or question..." rows={4} />
                      </div>
                      <Button type="submit">Send Message</Button>
                    </form>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Helpful Resources</CardTitle>
              <CardDescription>Guides and resources to help you manage your loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Loan Application Guide</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      A step-by-step guide to completing your loan application successfully.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Guide
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Document Checklist</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      A comprehensive list of documents required for different types of loans.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Checklist
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Financial Planning</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Tips and strategies for managing your finances and loan repayments.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Guide
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Credit Score Guide</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Understanding your credit score and how to improve it for better loan terms.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Guide
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Loan Glossary</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Definitions of common loan terms and financial jargon.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Glossary
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Video Tutorials</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Video guides explaining various aspects of the loan process.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Watch Videos
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Need more help?</AlertTitle>
            <AlertDescription>
              If you can't find what you're looking for, please contact our support team.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

