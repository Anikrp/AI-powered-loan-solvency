"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import type { LoanApplication } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { FileText, CreditCard, Calendar, DollarSign, CheckCircle, XCircle, Clock, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ApplicationDetailProps {
  application: LoanApplication
}

export function ApplicationDetail({ application }: ApplicationDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success"
      case "rejected":
        return "destructive"
      case "under_review":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "under_review":
        return <Clock className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle>Loan Application</CardTitle>
            <CardDescription>Application ID: {application.id}</CardDescription>
          </div>
          <Badge className="w-fit flex items-center gap-1" variant={getStatusColor(application.status) as any}>
            {getStatusIcon(application.status)}
            {application.status === "approved" && "Approved"}
            {application.status === "rejected" && "Rejected"}
            {application.status === "submitted" && "Submitted"}
            {application.status === "under_review" && "Under Review"}
            {application.status === "draft" && "Draft"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Application Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="status">Status & Timeline</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Loan Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="font-medium">${formatCurrency(application.loanAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Term</span>
                      <span className="font-medium">{application.loanTerm} months</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Purpose</span>
                      <span className="font-medium">{application.loanPurpose}</span>
                    </div>
                    {application.riskScore !== undefined && (
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Risk Score</span>
                          <span className="font-medium">{application.riskScore}/100</span>
                        </div>
                        <Progress value={application.riskScore} max={100} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Financial Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Employment</span>
                      <span className="font-medium">{application.employmentStatus}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Monthly Income</span>
                      <span className="font-medium">${formatCurrency(application.incomeMonthly)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Existing Debts</span>
                      <span className="font-medium">${formatCurrency(application.existingDebts)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Credit Score</span>
                      <span className="font-medium">{application.creditScore || "Not Available"}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm text-muted-foreground">Full Name</h4>
                      <p>{application.applicantName}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm text-muted-foreground">Email</h4>
                      <p>{application.email}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm text-muted-foreground">Phone</h4>
                      <p>{application.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required Documents</CardTitle>
                <CardDescription>Documents submitted with your application</CardDescription>
              </CardHeader>
              <CardContent>
                {application.documents.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Documents</AlertTitle>
                    <AlertDescription>No documents have been submitted with this application.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {application.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">{doc.type.replace("_", " ")}</p>
                          </div>
                        </div>
                        <Badge variant={doc.verified ? "success" : "outline"}>
                          {doc.verified ? "Verified" : "Pending Verification"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Status</CardTitle>
                <CardDescription>Current status and timeline of your application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {application.status === "approved" && (
                    <Alert variant="success">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Application Approved</AlertTitle>
                      <AlertDescription>Congratulations! Your loan application has been approved.</AlertDescription>
                    </Alert>
                  )}

                  {application.status === "rejected" && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Application Rejected</AlertTitle>
                      <AlertDescription>
                        We're sorry, but your loan application has been rejected.
                        {application.aiRecommendation?.reasons && (
                          <ul className="mt-2 list-disc pl-5">
                            {application.aiRecommendation.reasons.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  {application.status === "under_review" && (
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertTitle>Under Review</AlertTitle>
                      <AlertDescription>Your application is currently being reviewed by our team.</AlertDescription>
                    </Alert>
                  )}

                  {application.status === "submitted" && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Application Submitted</AlertTitle>
                      <AlertDescription>
                        Your application has been submitted successfully and is pending review.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="relative space-y-6">
                    <h3 className="text-base font-medium">Application Timeline</h3>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:left-[15px] before:h-full before:w-[1px] before:bg-muted">
                      <div className="flex gap-3">
                        <div className="relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Application Created</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(application.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {application.status !== "draft" && (
                        <div className="flex gap-3">
                          <div className="relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">Application Submitted</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(application.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {(application.status === "approved" || application.status === "rejected") && (
                        <div className="flex gap-3">
                          <div className="relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              Application {application.status === "approved" ? "Approved" : "Rejected"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(application.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

