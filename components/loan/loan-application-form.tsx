"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createApplication, submitApplication } from "@/lib/dummy-data"

const loanApplicationSchema = z.object({
  applicantName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  loanAmount: z.coerce.number().min(1000, "Loan amount must be at least $1,000"),
  loanPurpose: z.string().min(5, "Please describe the purpose of the loan"),
  loanTerm: z.coerce.number().min(6, "Loan term must be at least 6 months"),
  employmentStatus: z.enum(["Employed", "Self-Employed", "Unemployed", "Retired"]),
  incomeMonthly: z.coerce.number().min(1000, "Monthly income must be at least $1,000"),
  existingDebts: z.coerce.number(),
})

type LoanApplicationFormValues = z.infer<typeof loanApplicationSchema>

export function LoanApplicationForm({ userId }: { userId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoanApplicationFormValues>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      applicantName: "",
      email: "",
      phone: "",
      loanAmount: 25000,
      loanPurpose: "",
      loanTerm: 36,
      employmentStatus: "Employed",
      incomeMonthly: 5000,
      existingDebts: 0,
    },
  })

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  async function onSubmit(data: LoanApplicationFormValues) {
    setIsLoading(true)

    try {
      // Create loan application using our dummy data functions
      const newApp = createApplication({
        ...data,
        userId,
        documents: [
          // Initially, we'll create empty documents that will be uploaded later
          {
            id: `doc-${Date.now()}-1`,
            type: "id",
            name: "ID Document",
            url: "",
            verified: false,
            uploadedAt: new Date(),
          },
          {
            id: `doc-${Date.now()}-2`,
            type: "income_proof",
            name: "Income Proof",
            url: "",
            verified: false,
            uploadedAt: new Date(),
          },
        ],
      })

      // Submit the application
      submitApplication(newApp.id)

      toast({
        title: "Application submitted",
        description: "Your loan application has been successfully submitted.",
      })

      // Redirect to the application details page
      router.push(`/applications/${newApp.id}`)
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Loan Application</CardTitle>
        <CardDescription>
          {currentStep === 1 && "Provide your personal information"}
          {currentStep === 2 && "Specify the loan details"}
          {currentStep === 3 && "Financial information"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="applicantName">Full Name</Label>
                <Input id="applicantName" placeholder="John Doe" disabled={isLoading} {...register("applicantName")} />
                {errors.applicantName && <p className="text-sm text-destructive">{errors.applicantName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="(555) 123-4567" disabled={isLoading} {...register("phone")} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  min={1000}
                  step={1000}
                  disabled={isLoading}
                  {...register("loanAmount")}
                />
                {errors.loanAmount && <p className="text-sm text-destructive">{errors.loanAmount.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanPurpose">Loan Purpose</Label>
                <Textarea
                  id="loanPurpose"
                  placeholder="Please describe why you need this loan"
                  disabled={isLoading}
                  {...register("loanPurpose")}
                />
                {errors.loanPurpose && <p className="text-sm text-destructive">{errors.loanPurpose.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (months)</Label>
                <Input id="loanTerm" type="number" min={6} max={360} disabled={isLoading} {...register("loanTerm")} />
                {errors.loanTerm && <p className="text-sm text-destructive">{errors.loanTerm.message}</p>}
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="employmentStatus">Employment Status</Label>
                <Select
                  defaultValue={watch("employmentStatus")}
                  onValueChange={(value) => setValue("employmentStatus", value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="employmentStatus">
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employed">Employed</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employmentStatus && (
                  <p className="text-sm text-destructive">{errors.employmentStatus.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="incomeMonthly">Monthly Income ($)</Label>
                <Input
                  id="incomeMonthly"
                  type="number"
                  min={0}
                  step={100}
                  disabled={isLoading}
                  {...register("incomeMonthly")}
                />
                {errors.incomeMonthly && <p className="text-sm text-destructive">{errors.incomeMonthly.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="existingDebts">Existing Debts/Loans ($)</Label>
                <Input
                  id="existingDebts"
                  type="number"
                  min={0}
                  step={100}
                  disabled={isLoading}
                  {...register("existingDebts")}
                />
                {errors.existingDebts && <p className="text-sm text-destructive">{errors.existingDebts.message}</p>}
              </div>
            </>
          )}

          <div className="mt-6 space-y-2">
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${i + 1 <= currentStep ? "bg-primary" : "bg-secondary"}`}
                />
              ))}
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1 || isLoading}>
            Previous
          </Button>
          {currentStep < totalSteps ? (
            <Button type="button" onClick={nextStep} disabled={isLoading}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

