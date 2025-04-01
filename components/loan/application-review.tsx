"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { LoanApplication } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { reviewApplication, processApplication } from "@/lib/dummy-data"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertTriangle, FileCheck, Clock, XCircle, Info } from "lucide-react"

interface ApplicationReviewProps {
  application: LoanApplication
}

export function ApplicationReview({ application }: ApplicationReviewProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [reviewResults, setReviewResults] = useState<{
    risk?: { score: number; recommended: boolean; reasons: string[] }
    fraud?: { fraudDetected: boolean; reasons: string[] }
    documents?: { verified: boolean; failedDocuments: string[] }
  } | null>(null)

  const isUnderReview = application.status === "under_review"
  const isSubmitted = application.status === "submitted"
  const isProcessable = isUnderReview || application.status === "submitted"

  async function handleReview() {
    setIsLoading(true)
    try {
      // Use our dummy data function to review the application
      const updatedApp = reviewApplication(application.id)

      if (updatedApp) {
        // Generate mock review results
        const mockResults = {
          risk: updatedApp.aiRecommendation || {
            score: 75,
            recommended: true,
            reasons: ["Good credit history", "Appropriate loan amount", "Stable employment"],
          },
          fraud: {
            fraudDetected: false,
            reasons: [],
          },
          documents: {
            verified: true,
            failedDocuments: [],
          },
        }

        setReviewResults(mockResults)

        toast({
          title: "Application reviewed",
          description: "The AI system has completed the review.",
        })

        // Refresh the page to show updated status
        router.refresh()
      } else {
        toast({
          title: "Review failed",
          description: "Could not review the application",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error reviewing application:", error)
      toast({
        title: "Review failed",
        description: "There was an error reviewing this application.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleProcess(decision: "approve" | "reject") {
    setIsLoading(true)
    try {
      // Use our dummy data function to process the application
      const updatedApp = processApplication(application.id, decision)

      if (updatedApp) {
        toast({
          title: `Application ${decision === "approve" ? "approved" : "rejected"}`,
          description: `The application has been ${decision === "approve" ? "approved" : "rejected"} successfully.`,
        })

        // Refresh the page to show updated status
        router.refresh()
      } else {
        toast({
          title: "Process failed",
          description: "Could not process the application",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error processing application:", error)
      toast({
        title: "Process failed",
        description: "There was an error processing this application.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get risk assessment either from the application or from the review results
  const riskAssessment = reviewResults?.risk || application.aiRecommendation

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Application Review</CardTitle>
            <CardDescription>Review loan application for {application.applicantName}</CardDescription>
          </div>
          <Badge
            variant={
              application.status === "approved"
                ? "success"
                : application.status === "rejected"
                  ? "destructive"
                  : application.status === "under_review"
                    ? "secondary"
                    : "outline"
            }
          >
            {application.status === "approved" && "Approved"}
            {application.status === "rejected" && "Rejected"}
            {application.status === "submitted" && "Submitted"}
            {application.status === "under_review" && "Under Review"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Applicant Name</h3>
                  <p className="text-sm text-muted-foreground">{application.applicantName}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Email</h3>
                  <p className="text-sm text-muted-foreground">{application.email}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Phone</h3>
                  <p className="text-sm text-muted-foreground">{application.phone}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Employment Status</h3>
                  <p className="text-sm text-muted-foreground">{application.employmentStatus}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Loan Amount</h3>
                  <p className="text-sm text-muted-foreground">${formatCurrency(application.loanAmount)}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Loan Term</h3>
                  <p className="text-sm text-muted-foreground">{application.loanTerm} months</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Monthly Income</h3>
                  <p className="text-sm text-muted-foreground">${formatCurrency(application.incomeMonthly)}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Existing Debts</h3>
                  <p className="text-sm text-muted-foreground">${formatCurrency(application.existingDebts)}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium leading-none">Loan Purpose</h3>
                <p className="text-sm text-muted-foreground">{application.loanPurpose}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium leading-none">Application Timeline</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm">{new Date(application.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="text-sm">{new Date(application.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="risk" className="space-y-4">
            {!riskAssessment ? (
              <div className="flex flex-col items-center justify-center space-y-4 p-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">Risk Assessment Not Available</h3>
                <p className="text-center text-muted-foreground">
                  Review the application to generate an AI-powered risk assessment.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <div
                    className="w-32 h-32 rounded-full border-8 flex items-center justify-center mb-4"
                    style={{
                      borderColor: riskAssessment.score >= 60 ? "hsl(var(--success))" : "hsl(var(--destructive))",
                    }}
                  >
                    <div className="text-3xl font-bold">{riskAssessment.score}</div>
                  </div>
                  <div className="text-lg font-semibold">
                    {riskAssessment.recommended ? (
                      <span className="text-success flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Recommended for Approval
                      </span>
                    ) : (
                      <span className="text-destructive flex items-center">
                        <XCircle className="mr-2 h-5 w-5" />
                        Not Recommended
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Assessment Factors</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Debt-to-Income Ratio</span>
                        <span className="font-medium">
                          {Math.round((application.existingDebts / (application.incomeMonthly * 12)) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.round((application.existingDebts / (application.incomeMonthly * 12)) * 100)}
                        max={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Credit Score</span>
                        <span className="font-medium">{application.creditScore || "N/A"}</span>
                      </div>
                      {application.creditScore && <Progress value={application.creditScore} max={850} />}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Loan-to-Income Ratio</span>
                        <span className="font-medium">
                          {(application.loanAmount / (application.incomeMonthly * 12)).toFixed(1)}x
                        </span>
                      </div>
                      <Progress value={application.loanAmount / (application.incomeMonthly * 12)} max={5} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Assessment Reasons</h3>
                  <div className="space-y-2">
                    {riskAssessment.reasons.map((reason, index) => (
                      <Alert key={index}>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Factor {index + 1}</AlertTitle>
                        <AlertDescription>{reason}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="documents" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Submitted Documents</h3>
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
                        <FileCheck className="h-5 w-5 text-muted-foreground" />
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

              {reviewResults?.documents && (
                <div className="mt-6 space-y-2">
                  <h3 className="text-lg font-medium">Document Verification Results</h3>
                  {reviewResults.documents.verified ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>All Documents Verified</AlertTitle>
                      <AlertDescription>All submitted documents have been verified successfully.</AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Document Verification Issues</AlertTitle>
                      <AlertDescription>
                        The following documents could not be verified:
                        <ul className="mt-2 ml-6 list-disc">
                          {reviewResults.documents.failedDocuments.map((doc, i) => (
                            <li key={i}>{doc}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="compliance" className="space-y-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">KYC/AML Status</h3>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>KYC/AML Check</AlertTitle>
                  <AlertDescription>
                    {reviewResults?.fraud ? (
                      reviewResults.fraud.fraudDetected ? (
                        <span className="text-destructive">Potential fraud detected</span>
                      ) : (
                        <span className="text-success">No compliance issues detected</span>
                      )
                    ) : (
                      "Pending review"
                    )}
                  </AlertDescription>
                </Alert>

                {reviewResults?.fraud && reviewResults.fraud.fraudDetected && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Fraud Detection Results</h4>
                    <div className="space-y-2">
                      {reviewResults.fraud.reasons.map((reason, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Fraud Risk {index + 1}</AlertTitle>
                          <AlertDescription>{reason}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Regulatory Compliance</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Background Check</h4>
                      <p className="text-sm text-muted-foreground">Passed</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Identity Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        {application.documents.some((d) => d.type === "id" && d.verified) ? "Verified" : "Pending"}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Income Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        {application.documents.some((d) => d.type === "income_proof" && d.verified)
                          ? "Verified"
                          : "Pending"}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Credit Check</h4>
                      <p className="text-sm text-muted-foreground">
                        {application.creditScore ? "Complete" : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-4">
          {isSubmitted && (
            <Button onClick={handleReview} disabled={isLoading}>
              <Clock className="mr-2 h-4 w-4" />
              {isLoading ? "Processing..." : "Review Application"}
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {isProcessable && (
            <>
              <Button variant="outline" onClick={() => handleProcess("reject")} disabled={isLoading}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={() => handleProcess("approve")} disabled={isLoading}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

