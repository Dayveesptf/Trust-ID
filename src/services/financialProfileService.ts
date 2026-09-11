import { apiRequest } from "./api";

/* -------------------------------------------------------------------------- */
/* Financial Profile                                                          */
/* -------------------------------------------------------------------------- */

export interface FinancialProfilePayload {
  incomeConsistency: number;
  savingsRate: number;
  savingsStreakMonths: number;
  repaymentOnTimeRate: number;
  missedPayments: number;
  cashFlowStability: number;
  lowBalanceDays: number;
  budgetingDiscipline: number;
  recurringPaymentConsistency: number;
  averageMonthlyInflow: number;
  averageMonthlySavings: number;
  monthlyExpenses: number;
}

export interface FinancialProfile
  extends FinancialProfilePayload {
  _id: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/* Trust Profile                                                              */
/* -------------------------------------------------------------------------- */

export interface TrustFactor {
  score: number;
  max: number;
}

export interface TrustProfile {
  _id: string;
  userId: string;

  totalScore: number;
  band: string;

  factors: {
    incomeConsistency: TrustFactor;
    savingsBehaviour: TrustFactor;
    repaymentBehaviour: TrustFactor;
    cashFlowStability: TrustFactor;
    financialDiscipline: TrustFactor;
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

  createdAt?: string;
  updatedAt?: string;
}

export interface TrustProfileResponse {
  profile: TrustProfile;
  recommendations: string[];
}

/* -------------------------------------------------------------------------- */
/* Score History                                                              */
/* -------------------------------------------------------------------------- */

export interface ScoreHistoryItem {
  _id: string;
  userId: string;

  score: number;
  previousScore: number;
  change: number;

  reason: string;

  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/* Save Financial Profile                                                     */
/* -------------------------------------------------------------------------- */

export async function saveFinancialProfile(
  payload: FinancialProfilePayload
): Promise<FinancialProfile> {
  return apiRequest<FinancialProfile>(
    "/financial-profile",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Get Financial Profile                                                      */
/* -------------------------------------------------------------------------- */

export async function getFinancialProfile(): Promise<
  FinancialProfile | null
> {
  return apiRequest<FinancialProfile | null>(
    "/financial-profile"
  );
}

/* -------------------------------------------------------------------------- */
/* Generate Trust Profile                                                     */
/* -------------------------------------------------------------------------- */

export async function generateTrustProfile(): Promise<TrustProfileResponse> {
  return apiRequest<TrustProfileResponse>(
    "/trust-profile/generate",
    {
      method: "POST",
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Get Trust Profile                                                          */
/* -------------------------------------------------------------------------- */

export async function getTrustProfile(): Promise<
  TrustProfile | null
> {
  return apiRequest<TrustProfile | null>(
    "/trust-profile"
  );
}

/* -------------------------------------------------------------------------- */
/* Get Score History                                                          */
/* -------------------------------------------------------------------------- */

export async function getScoreHistory(): Promise<
  ScoreHistoryItem[]
> {
  return apiRequest<ScoreHistoryItem[]>(
    "/trust-profile/history"
  );
}

/* -------------------------------------------------------------------------- */
/* Get Trust Insights                                                         */
/* -------------------------------------------------------------------------- */

export async function getTrustInsights(): Promise<{
  strengths: string[];
  opportunities: string[];
  recommendations: string[];
}> {
  return apiRequest<{
    strengths: string[];
    opportunities: string[];
    recommendations: string[];
  }>("/trust-profile/insights");
}