import { apiRequest } from "./api";

export interface EcobankCustomer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt?: string;
  onboardingCompleted: boolean;
  trustProfile: {
    score: number;
    band: string;
  } | null;
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

  factors: {
    incomeConsistency: CustomerTrustFactor;
    savingsBehaviour: CustomerTrustFactor;
    repaymentBehaviour: CustomerTrustFactor;
    cashFlowStability: CustomerTrustFactor;
    financialDiscipline: CustomerTrustFactor;
  };

  strengths: string[];
  opportunities: string[];

  evidence: {
    averageMonthlyInflow: number;
    averageMonthlySavings: number;
    repaymentOnTimeRate: number;
    savingsRate: number;
  };

  generatedAt: string;
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
  };

  trustProfile: EcobankTrustProfile | null;

  financialEvidence: {
    averageMonthlyInflow: number;
    averageMonthlySavings: number;
    repaymentOnTimeRate: number;
    savingsRate: number;
    cashFlowStability: number;
  } | null;

  decisionNotice: string;
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

export async function getEcobankCustomers(): Promise<
  EcobankCustomer[]
> {
  return apiRequest<EcobankCustomer[]>(
    "/ecobank/customers"
  );
}

export async function getEcobankCustomer(
  customerId: string
): Promise<EcobankCustomerDetail> {
  return apiRequest<EcobankCustomerDetail>(
    `/ecobank/customers/${customerId}`
  );
}

export async function getEcobankOpportunities(): Promise<
  EcobankOpportunity[]
> {
  return apiRequest<EcobankOpportunity[]>(
    "/ecobank/opportunities"
  );
}