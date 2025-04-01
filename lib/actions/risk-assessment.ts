"use server"
import { Database } from "@/lib/db"

export async function assessRisk(
  applicationId: string,
): Promise<{ score: number; recommended: boolean; reasons: string[] }> {
  const application = await Database.getApplicationById(applicationId)
  if (!application) {
    throw new Error("Application not found")
  }

  // Fetch credit report
  const creditReport = await Database.getCreditReport(application.userId)
  if (!creditReport) {
    throw new Error("Credit report not found")
  }

  // Calculate debt-to-income ratio (DTI)
  const monthlyLoanPayment = calculateMonthlyPayment(application.loanAmount, application.loanTerm)
  const dti = (creditReport.monthlyObligations + monthlyLoanPayment) / application.incomeMonthly

  // Calculate loan-to-income ratio (LTI)
  const lti = application.loanAmount / (application.incomeMonthly * 12)

  // Define risk thresholds
  const dtiThreshold = 0.43 // 43% is a common threshold
  const ltiThreshold = 3.5 // 3.5x annual income
  const creditScoreThreshold = 650

  // AI risk scoring algorithm
  let score = 0
  const reasons = []

  // Credit score component (0-40 points)
  if (creditReport.score >= 750) {
    score += 40
  } else if (creditReport.score >= 700) {
    score += 35
  } else if (creditReport.score >= 650) {
    score += 25
  } else if (creditReport.score >= 600) {
    score += 15
  } else {
    score += 5
    reasons.push("Low credit score increases risk")
  }

  // DTI component (0-30 points)
  if (dti <= 0.2) {
    score += 30
  } else if (dti <= 0.3) {
    score += 25
  } else if (dti <= dtiThreshold) {
    score += 15
  } else {
    score += 5
    reasons.push("Debt-to-income ratio too high")
  }

  // LTI component (0-20 points)
  if (lti <= 1) {
    score += 20
  } else if (lti <= 2) {
    score += 15
  } else if (lti <= ltiThreshold) {
    score += 10
  } else {
    score += 0
    reasons.push("Loan amount too high relative to income")
  }

  // Employment stability (0-10 points)
  // For simplicity, we'll assume stable employment
  score += 10

  // AI recommendation
  const recommended = score >= 60 && creditReport.score >= creditScoreThreshold

  // If score is good but no recommendation, add reason
  if (score >= 60 && !recommended) {
    reasons.push("Credit score below minimum threshold")
  }

  // Add positive reasons if recommended
  if (recommended && reasons.length === 0) {
    if (creditReport.score >= 700) reasons.push("Excellent credit history")
    if (dti <= 0.3) reasons.push("Strong debt management")
    if (lti <= 2) reasons.push("Appropriate loan amount for income")
  }

  return {
    score,
    recommended,
    reasons: reasons.length > 0 ? reasons : ["No specific risk factors identified"],
  }
}

function calculateMonthlyPayment(principal: number, termInMonths: number): number {
  // Simple calculation for demo purposes
  // In reality, this would include interest rates
  return principal / termInMonths
}

export async function verifyDocuments(
  applicationId: string,
): Promise<{ verified: boolean; failedDocuments: string[] }> {
  const application = await Database.getApplicationById(applicationId)
  if (!application) {
    throw new Error("Application not found")
  }

  // Simulate document verification with AI
  // In a real system, this would use OCR and document validation AI services
  const failedDocuments: string[] = []
  let allVerified = true

  // Simulate verification process for each document
  for (const doc of application.documents) {
    // Mock verification - randomly verify 80% of documents
    const isVerified = Math.random() > 0.2

    if (!isVerified) {
      failedDocuments.push(doc.name)
      allVerified = false
    } else {
      // Update the document status in the database
      await Database.updateApplication(applicationId, {
        documents: application.documents.map((d) => (d.id === doc.id ? { ...d, verified: true } : d)),
      })
    }
  }

  return {
    verified: allVerified,
    failedDocuments,
  }
}

export async function detectFraud(applicationId: string): Promise<{ fraudDetected: boolean; reasons: string[] }> {
  const application = await Database.getApplicationById(applicationId)
  if (!application) {
    throw new Error("Application not found")
  }

  // Fetch credit report
  const creditReport = await Database.getCreditReport(application.userId)
  if (!creditReport) {
    throw new Error("Credit report not found")
  }

  // Simulated fraud detection algorithm
  // In a real system, this would use machine learning models
  const reasons: string[] = []
  let fraudDetected = false

  // Check for unusually high loan amount relative to income
  if (application.loanAmount > application.incomeMonthly * 24) {
    reasons.push("Unusual loan amount relative to income")
    fraudDetected = true
  }

  // Check for mismatch in reported vs. credit bureau income
  // (simulated for this example)
  const simulatedBureauIncome = 4500
  if (Math.abs(application.incomeMonthly - simulatedBureauIncome) / simulatedBureauIncome > 0.3) {
    reasons.push("Significant income discrepancy")
    fraudDetected = true
  }

  return {
    fraudDetected,
    reasons,
  }
}

