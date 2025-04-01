export type UserRole = "applicant" | "officer" | "admin"

export interface LoanApplication {
  id: string
  userId: string
  applicantName: string
  email: string
  phone: string
  loanAmount: number
  loanPurpose: string
  loanTerm: number
  employmentStatus: string
  incomeMonthly: number
  existingDebts: number
  creditScore?: number
  riskScore?: number
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected"
  documents: Document[]
  createdAt: Date
  updatedAt: Date
  aiRecommendation?: {
    recommended: boolean
    score: number
    reasons: string[]
  }
}

export interface Document {
  id: string
  type: "id" | "income_proof" | "tax_return" | "bank_statement" | "other"
  name: string
  url: string
  verified: boolean
  uploadedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  applications?: LoanApplication[]
}

export interface CreditReport {
  userId: string
  score: number
  history: {
    loanType: string
    status: string
    amount: number
    startDate: Date
    endDate?: Date
  }[]
  totalDebts: number
  monthlyObligations: number
}

export interface LoanType {
  id: string
  name: string
  description: string
  interestRate: number
  minAmount: number
  maxAmount: number
  minTerm: number
  maxTerm: number
  requiredDocuments: string[]
}

