import type { LoanApplication, User, CreditReport, LoanType } from "@/types"

// Mock database for demonstration - in production this would connect to a real database
export class Database {
  private static users: User[] = [
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

  private static loanTypes: LoanType[] = [
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

  private static applications: LoanApplication[] = [
    {
      id: "1",
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
    },
  ]

  private static creditReports: CreditReport[] = [
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

  // User methods
  static async getUser(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  static async createUser(user: Omit<User, "id">): Promise<User> {
    const newUser = {
      ...user,
      id: `user-${Date.now()}`,
    }
    this.users.push(newUser)
    return newUser
  }

  // Loan application methods
  static async getApplications(filter?: Partial<LoanApplication>): Promise<LoanApplication[]> {
    if (!filter) return this.applications

    return this.applications.filter((app) => {
      for (const key in filter) {
        if (
          filter[key as keyof LoanApplication] !== undefined &&
          app[key as keyof LoanApplication] !== filter[key as keyof LoanApplication]
        ) {
          return false
        }
      }
      return true
    })
  }

  static async getApplicationById(id: string): Promise<LoanApplication | null> {
    return this.applications.find((app) => app.id === id) || null
  }

  static async createApplication(
    application: Omit<LoanApplication, "id" | "createdAt" | "updatedAt" | "status">,
  ): Promise<LoanApplication> {
    const newApplication = {
      ...application,
      id: `app-${Date.now()}`,
      status: "draft" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.applications.push(newApplication as LoanApplication)
    return newApplication as LoanApplication
  }

  static async updateApplication(id: string, data: Partial<LoanApplication>): Promise<LoanApplication | null> {
    const index = this.applications.findIndex((app) => app.id === id)
    if (index === -1) return null

    const updatedApplication = {
      ...this.applications[index],
      ...data,
      updatedAt: new Date(),
    }
    this.applications[index] = updatedApplication
    return updatedApplication
  }

  // Credit report methods
  static async getCreditReport(userId: string): Promise<CreditReport | null> {
    return this.creditReports.find((report) => report.userId === userId) || null
  }

  // Loan type methods
  static async getLoanTypes(): Promise<LoanType[]> {
    return this.loanTypes
  }

  static async getLoanTypeById(id: string): Promise<LoanType | null> {
    return this.loanTypes.find((type) => type.id === id) || null
  }
}

