"use server"
import { Database } from "@/lib/db"
import type { LoanApplication, Document as LoanDocument, LoanType } from "@/types"
import { assessRisk, verifyDocuments, detectFraud } from "./risk-assessment"

export async function getLoanTypes(): Promise<LoanType[]> {
  return Database.getLoanTypes()
}

export async function createLoanApplication(
  data: Omit<LoanApplication, "id" | "createdAt" | "updatedAt" | "status" | "documents"> & {
    documents: Omit<LoanDocument, "id" | "verified" | "uploadedAt">[]
  },
): Promise<{ applicationId: string }> {
  // Convert documents to the right format
  const formattedDocuments: LoanDocument[] = data.documents.map((doc) => ({
    ...doc,
    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    verified: false,
    uploadedAt: new Date(),
  }))

  const application = await Database.createApplication({
    ...data,
    documents: formattedDocuments,
  })

  return { applicationId: application.id }
}

export async function submitLoanApplication(applicationId: string): Promise<{ success: boolean; message: string }> {
  const application = await Database.getApplicationById(applicationId)
  if (!application) {
    return { success: false, message: "Application not found" }
  }

  if (application.status !== "draft") {
    return { success: false, message: "Application is already submitted" }
  }

  // Update status to submitted
  await Database.updateApplication(applicationId, { status: "submitted" })

  // Perform initial risk assessment
  try {
    const riskAssessment = await assessRisk(applicationId)
    await Database.updateApplication(applicationId, {
      riskScore: riskAssessment.score,
      aiRecommendation: riskAssessment,
    })
  } catch (error) {
    console.error("Risk assessment failed:", error)
    // Continue with submission even if risk assessment fails
  }

  return { success: true, message: "Application submitted successfully" }
}

export async function getLoanApplicationsByUser(userId: string): Promise<LoanApplication[]> {
  return Database.getApplications({ userId })
}

export async function getLoanApplicationById(applicationId: string): Promise<LoanApplication | null> {
  return Database.getApplicationById(applicationId)
}

export async function getAllLoanApplications(): Promise<LoanApplication[]> {
  return Database.getApplications()
}

export async function processLoanApplication(
  applicationId: string,
  decision: "approve" | "reject",
  notes?: string,
): Promise<{ success: boolean; message: string }> {
  const application = await Database.getApplicationById(applicationId)
  if (!application) {
    return { success: false, message: "Application not found" }
  }

  if (application.status !== "under_review") {
    return {
      success: false,
      message: `Cannot process application in ${application.status} status`,
    }
  }

  // Update application status
  await Database.updateApplication(applicationId, {
    status: decision === "approve" ? "approved" : "rejected",
  })

  return {
    success: true,
    message: `Application ${decision === "approve" ? "approved" : "rejected"} successfully`,
  }
}

export async function reviewLoanApplication(applicationId: string): Promise<{
  success: boolean
  message: string
  risk?: { score: number; recommended: boolean; reasons: string[] }
  fraud?: { fraudDetected: boolean; reasons: string[] }
  documents?: { verified: boolean; failedDocuments: string[] }
}> {
  const application = await Database.getApplicationById(applicationId)
  if (!application) {
    return { success: false, message: "Application not found" }
  }

  if (application.status !== "submitted") {
    return {
      success: false,
      message: `Cannot review application in ${application.status} status`,
    }
  }

  // Update status to under review
  await Database.updateApplication(applicationId, { status: "under_review" })

  // Run AI evaluation processes in parallel
  try {
    const [risk, fraud, documents] = await Promise.all([
      assessRisk(applicationId),
      detectFraud(applicationId),
      verifyDocuments(applicationId),
    ])

    // Store the results with the application
    await Database.updateApplication(applicationId, {
      riskScore: risk.score,
      aiRecommendation: risk,
    })

    return {
      success: true,
      message: "Application review completed",
      risk,
      fraud,
      documents,
    }
  } catch (error) {
    console.error("Review process failed:", error)
    return { success: false, message: "Review process failed" }
  }
}

