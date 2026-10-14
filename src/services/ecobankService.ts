import { apiRequest } from "./api";

export type ReviewStatus =
  | "NOT_REVIEWED"
  | "IN_REVIEW"
  | "NEEDS_MORE_INFORMATION"
  | "REFERRED_TO_CREDIT_TEAM"
  | "REVIEW_COMPLETED";

export type ReviewNextStep =
  | "CONTINUE_EXISTING_LENDING_REVIEW"
  | "REQUEST_MORE_INFORMATION"
  | "REFER_TO_CREDIT_TEAM"
  | "NO_FURTHER_TRUSTID_REVIEW";

export interface EcobankReviewEvent {
  status: Exclude<ReviewStatus, "NOT_REVIEWED">;
  note: string;
  officerName: string;
  occurredAt: string;
}

export interface EcobankReview {
  _id?: string;
  status: ReviewStatus;
  nextStep: ReviewNextStep;
  note: string;
  lastReviewedByName: string;
  lastReviewedAt: string | null;
  history: EcobankReviewEvent[];
}

export interface EcobankCustomer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt?: string;
  onboardingCompleted: boolean;
  sharingConsent?: {
    granted: boolean;
    grantedAt?: string;
    revokedAt?: string | null;
    version?: string;
  };
  trustProfile: {
    score: number;
    band: string;
    generatedAt?: string;
    dataSource: string;
    evidencePeriodMonths: number;
  } | null;
  review: EcobankReview;
}

export type EcobankCustomerListItem = EcobankCustomer;

export interface CustomerTrustFactor {
  score: number;
  max: number;
}

export interface EcobankTrustProfile {
  _id: string;
  userId: string;
  totalScore: number;
  band: string;
  dataSource: string;
  evidencePeriodMonths: number;
  scoreModelVersion: string;
  factors: {
    incomeConsistency: CustomerTrustFactor;
    savingsBehaviour: CustomerTrustFactor;
    repaymentBehaviour: CustomerTrustFactor;
    cashFlowStability: CustomerTrustFactor;
    financialDiscipline: CustomerTrustFactor;
  };
  strengths: string[];
  opportunities: string[];
  recommendations: string[];
  evidence: {
    averageMonthlyInflow: number;
    averageMonthlySavings: number;
    repaymentOnTimeRate: number;
    savingsRate: number;
  };
  generatedAt: string;
}

export interface EcobankFinancialEvidence {
  averageMonthlyInflow: number;
  averageMonthlySavings: number;
  repaymentOnTimeRate: number;
  savingsRate: number;
  cashFlowStability: number;
  sourceType: string;
  evidencePeriodMonths: number;
  monthlyExpenses: number;
  missedPayments: number;
  lowBalanceDays: number;
  incomeConsistency: number;
  savingsStreakMonths: number;
  budgetingDiscipline: number;
  recurringPaymentConsistency: number;
}

export interface EcobankCustomerDetail {
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt?: string;
    onboardingCompleted: boolean;
    sharingConsent?: {
      granted: boolean;
      grantedAt?: string;
      revokedAt?: string | null;
      version?: string;
    };
  };
  trustProfile: EcobankTrustProfile | null;
  financialEvidence: EcobankFinancialEvidence | null;
  review: EcobankReview;
  decisionNotice: string;
}

export interface EcobankDashboardSummary {
  sharedProfiles: number;
  analysedProfiles: number;
  awaitingAnalysis: number;
  averageScore: number;
  scoreBands: Record<string, number>;
  reviews: Record<ReviewStatus, number>;
  prototypeDataSource: string;
  note: string;
}

export interface EcobankOpportunity {
  id: string;
  category: string;
  title: string;
  description: string;
  badge?: string;
  relevance: string;
  eligibility: string;
  action?: string;
}

export interface SaveReviewPayload {
  status: Exclude<ReviewStatus, "NOT_REVIEWED">;
  note: string;
}

export async function getEcobankDashboardSummary(): Promise<EcobankDashboardSummary> {
  return apiRequest<EcobankDashboardSummary>("/ecobank/summary");
}

export async function getEcobankCustomers(): Promise<EcobankCustomer[]> {
  return apiRequest<EcobankCustomer[]>("/ecobank/customers");
}

export async function getEcobankCustomer(customerId: string): Promise<EcobankCustomerDetail> {
  if (!customerId) throw new Error("Customer ID is required.");
  return apiRequest<EcobankCustomerDetail>(`/ecobank/customers/${encodeURIComponent(customerId)}`);
}

export async function saveEcobankCustomerReview(
  customerId: string,
  payload: SaveReviewPayload
): Promise<EcobankReview> {
  if (!customerId) throw new Error("Customer ID is required.");
  return apiRequest<EcobankReview>(`/ecobank/customers/${encodeURIComponent(customerId)}/review`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getEcobankOpportunities(): Promise<EcobankOpportunity[]> {
  return apiRequest<EcobankOpportunity[]>("/ecobank/opportunities");
}
