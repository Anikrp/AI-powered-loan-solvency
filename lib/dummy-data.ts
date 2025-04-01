import type { LoanApplication, User, CreditReport, LoanType } from "@/types"

// Mock users
export const dummyUsers: User[] = [
  {
    id: "1",
    name: "Loan Officer",
    email: "officer@bdbank.com",
    role: "officer",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    role: "applicant",
  },
]

// Mock loan types
export const dummyLoanTypes: LoanType[] = [
  {
    id: "1",
    name: "Personal Loan",
    description: "General purpose personal loan",
    interestRate: 9.5,
    minAmount: 1000,
    maxAmount: 50000,
    minTerm: 6,
    maxTerm: 60,
    requiredDocuments: ["id", "income_proof", "bank_statement"],
  },
  {
    id: "2",
    name: "Home Loan",
    description: "Loan for home purchase or renovation",
    interestRate: 7.5,
    minAmount: 10000,
    maxAmount: 500000,
    minTerm: 12,
    maxTerm: 360,
    requiredDocuments: ["id", "income_proof", "tax_return", "bank_statement", "property_documents"],
  },
  {
    id: "3",
    name: "Business Loan",
    description: "Loan for business purposes",
    interestRate: 11.0,
    minAmount: 5000,
    maxAmount: 200000,
    minTerm: 12,
    maxTerm: 84,
    requiredDocuments: ["id", "income_proof", "tax_return", "bank_statement", "business_plan"],
  },
]

// Mock loan applications
export const dummyApplications: LoanApplication[] = [
  {
    id: "app-1",
    userId: "2",
    applicantName: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    loanAmount: 25000,
    loanPurpose: "Home renovation",
    loanTerm: 36,
    employmentStatus: "Employed",
    incomeMonthly: 5000,
    existingDebts: 10000,
    creditScore: 720,
    riskScore: 76,
    status: "submitted",
    documents: [
      {
        id: "doc1",
        type: "id",
        name: "ID Card",
        url: "/documents/id.pdf",
        verified: true,
        uploadedAt: new Date("2023-01-15"),
      },
      {
        id: "doc2",
        type: "income_proof",
        name: "Pay Stubs",
        url: "/documents/paystubs.pdf",
        verified: false,
        uploadedAt: new Date("2023-01-15"),
      },
    ],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
    aiRecommendation: {
      recommended: true,
      score: 76,
      reasons: ["Strong credit history", "Appropriate loan amount for income", "Stable employment"],
    },
  },
  {
    id: "app-2",
    userId: "2",
    applicantName: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    loanAmount: 10000,
    loanPurpose: "Debt consolidation",
    loanTerm: 24,
    employmentStatus: "Employed",
    incomeMonthly: 5000,
    existingDebts: 15000,
    creditScore: 680,
    riskScore: 65,
    status: "under_review",
    documents: [
      {
        id: "doc3",
        type: "id",
        name: "ID Card",
        url: "/documents/id.pdf",
        verified: true,
        uploadedAt: new Date("2023-02-20"),
      },
      {
        id: "doc4",
        type: "income_proof",
        name: "Pay Stubs",
        url: "/documents/paystubs.pdf",
        verified: true,
        uploadedAt: new Date("2023-02-20"),
      },
    ],
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-02-25"),
    aiRecommendation: {
      recommended: true,
      score: 65,
      reasons: ["Acceptable debt-to-income ratio", "Good payment history"],
    },
  },
  {
    id: "app-3",
    userId: "2",
    applicantName: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    loanAmount: 50000,
    loanPurpose: "Business expansion",
    loanTerm: 60,
    employmentStatus: "Self-Employed",
    incomeMonthly: 7000,
    existingDebts: 20000,
    creditScore: 750,
    riskScore: 82,
    status: "approved",
    documents: [
      {
        id: "doc5",
        type: "id",
        name: "ID Card",
        url: "/documents/id.pdf",
        verified: true,
        uploadedAt: new Date("2023-03-10"),
      },
      {
        id: "doc6",
        type: "income_proof",
        name: "Tax Returns",
        url: "/documents/tax.pdf",
        verified: true,
        uploadedAt: new Date("2023-03-10"),
      },
      {
        id: "doc7",
        type: "business_plan",
        name: "Business Plan",
        url: "/documents/business_plan.pdf",
        verified: true,
        uploadedAt: new Date("2023-03-10"),
      },
    ],
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-03-20"),
    aiRecommendation: {
      recommended: true,
      score: 82,
      reasons: ["Excellent credit score", "Strong income", "Solid business plan"],
    },
  },
  {
    id: "app-4",
    userId: "2",
    applicantName: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    loanAmount: 75000,
    loanPurpose: "Investment property",
    loanTerm: 120,
    employmentStatus: "Employed",
    incomeMonthly: 6000,
    existingDebts: 30000,
    creditScore: 630,
    riskScore: 45,
    status: "rejected",
    documents: [
      {
        id: "doc8",
        type: "id",
        name: "ID Card",
        url: "/documents/id.pdf",
        verified: true,
        uploadedAt: new Date("2023-04-05"),
      },
      {
        id: "doc9",
        type: "income_proof",
        name: "Pay Stubs",
        url: "/documents/paystubs.pdf",
        verified: true,
        uploadedAt: new Date("2023-04-05"),
      },
    ],
    createdAt: new Date("2023-04-05"),
    updatedAt: new Date("2023-04-15"),
    aiRecommendation: {
      recommended: false,
      score: 45,
      reasons: ["High debt-to-income ratio", "Insufficient income for loan amount", "Below average credit score"],
    },
  },
  // Additional applications for the officer view
  {
    id: "app-5",
    userId: "3",
    applicantName: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    loanAmount: 15000,
    loanPurpose: "Car purchase",
    loanTerm: 48,
    employmentStatus: "Employed",
    incomeMonthly: 4500,
    existingDebts: 5000,
    creditScore: 710,
    riskScore: 72,
    status: "submitted",
    documents: [
      {
        id: "doc10",
        type: "id",
        name: "ID Card",
        url: "/documents/id.pdf",
        verified: false,
        uploadedAt: new Date("2023-05-12"),
      },
      {
        id: "doc11",
        type: "income_proof",
        name: "Pay Stubs",
        url: "/documents/paystubs.pdf",
        verified: false,
        uploadedAt: new Date("2023-05-12"),
      },
    ],
    createdAt: new Date("2023-05-12"),
    updatedAt: new Date("2023-05-12"),
    aiRecommendation: {
      recommended: true,
      score: 72,
      reasons: ["Good credit history", "Low existing debt", "Stable employment"],
    },
  },
  {
    id: "app-6",
    userId: "4",
    applicantName: "Robert Johnson",
    email: "robert@example.com",
    phone: "555-123-4567",
    loanAmount: 100000,
    loanPurpose: "Home purchase",
    loanTerm: 240,
    employmentStatus: "Employed",
    incomeMonthly: 8000,
    existingDebts: 25000,
    creditScore: 760,
    riskScore: 85,
    status: "under_review",
    documents: [
      {
        id: "doc12",
        type: "id",
        name: "ID Card",
        url: "/documents/id.pdf",
        verified: true,
        uploadedAt: new Date("2023-06-01"),
      },
      {
        id: "doc13",
        type: "income_proof",
        name: "Pay Stubs",
        url: "/documents/paystubs.pdf",
        verified: true,
        uploadedAt: new Date("2023-06-01"),
      },
      {
        id: "doc14",
        type: "bank_statement",
        name: "Bank Statements",
        url: "/documents/bank.pdf",
        verified: false,
        uploadedAt: new Date("2023-06-01"),
      },
    ],
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2023-06-05"),
    aiRecommendation: {
      recommended: true,
      score: 85,
      reasons: ["Excellent credit score", "Strong income", "Low debt-to-income ratio"],
    },
  },
]

// Mock credit reports
export const dummyCreditReports: CreditReport[] = [
  {
    userId: "2",
    score: 720,
    history: [
      {
        loanType: "Credit Card",
        status: "Good Standing",
        amount: 5000,
        startDate: new Date("2020-03-15"),
      },
      {
        loanType: "Auto Loan",
        status: "Paid Off",
        amount: 15000,
        startDate: new Date("2018-05-10"),
        endDate: new Date("2021-05-10"),
      },
    ],
    totalDebts: 10000,
    monthlyObligations: 500,
  },
]

// Client-side data store functions
export function getUser(id: string): User | undefined {
  return dummyUsers.find((user) => user.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  return dummyUsers.find((user) => user.email === email)
}

export function getLoanApplicationsByUser(userId: string): LoanApplication[] {
  return dummyApplications.filter((app) => app.userId === userId)
}

export function getAllLoanApplications(): LoanApplication[] {
  return dummyApplications
}

export function getLoanApplicationById(id: string): LoanApplication | undefined {
  return dummyApplications.find((app) => app.id === id)
}

export function getLoanTypes(): LoanType[] {
  return dummyLoanTypes
}

export function getCreditReport(userId: string): CreditReport | undefined {
  return dummyCreditReports.find((report) => report.userId === userId)
}

// Mock authentication functions
export function login(email: string, password: string): User | null {
  // For demo purposes, any password works for our dummy users
  const user = getUserByEmail(email)
  if (user) {
    return user
  }
  return null
}

// Mock application functions
export function createApplication(data: Partial<LoanApplication>): LoanApplication {
  const newApp: LoanApplication = {
    id: `app-${Date.now()}`,
    userId: data.userId || "2",
    applicantName: data.applicantName || "John Doe",
    email: data.email || "john@example.com",
    phone: data.phone || "123-456-7890",
    loanAmount: data.loanAmount || 25000,
    loanPurpose: data.loanPurpose || "Personal loan",
    loanTerm: data.loanTerm || 36,
    employmentStatus: data.employmentStatus || "Employed",
    incomeMonthly: data.incomeMonthly || 5000,
    existingDebts: data.existingDebts || 10000,
    creditScore: 700,
    riskScore: 70,
    status: "draft",
    documents: data.documents || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  dummyApplications.push(newApp)
  return newApp
}

export function updateApplication(id: string, data: Partial<LoanApplication>): LoanApplication | null {
  const index = dummyApplications.findIndex((app) => app.id === id)
  if (index === -1) return null

  const updatedApp = {
    ...dummyApplications[index],
    ...data,
    updatedAt: new Date(),
  }

  dummyApplications[index] = updatedApp
  return updatedApp
}

export function submitApplication(id: string): LoanApplication | null {
  return updateApplication(id, {
    status: "submitted",
    riskScore: 75,
    aiRecommendation: {
      recommended: true,
      score: 75,
      reasons: ["Good credit history", "Appropriate loan amount", "Stable employment"],
    },
  })
}

export function reviewApplication(id: string): LoanApplication | null {
  return updateApplication(id, { status: "under_review" })
}

export function processApplication(id: string, decision: "approve" | "reject"): LoanApplication | null {
  return updateApplication(id, { status: decision === "approve" ? "approved" : "rejected" })
}

