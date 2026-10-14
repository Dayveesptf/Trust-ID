import { apiRequest } from "./api";

export interface OnboardingPayload {
  incomeSource: "salary" | "business" | "freelance" | "allowance" | "multiple" | "other";
  incomeFrequency: "daily" | "weekly" | "monthly" | "irregular";
  goals: ("save" | "access_credit" | "start_business" | "manage_spending" | "build_credibility")[];
}

export interface Onboarding {
  _id: string;
  userId: string;
  incomeSource: OnboardingPayload["incomeSource"];
  incomeFrequency: OnboardingPayload["incomeFrequency"];
  goals: OnboardingPayload["goals"];
  createdAt?: string;
  updatedAt?: string;
}

export interface SharingConsentResponse {
  sharingConsent: {
    granted: boolean;
    grantedAt?: string | null;
    revokedAt?: string | null;
    version: string;
  };
  message: string;
}

export async function saveOnboarding(payload: OnboardingPayload): Promise<Onboarding> {
  return apiRequest<Onboarding>("/onboarding", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getOnboarding(): Promise<Onboarding | null> {
  return apiRequest<Onboarding | null>("/onboarding");
}

export async function grantConsent(): Promise<{
  consent: { granted: boolean; grantedAt?: string; version: string };
}> {
  return apiRequest("/onboarding/consent", {
    method: "POST",
    body: JSON.stringify({ granted: true }),
  });
}

/** Share the already-generated profile with the Ecobank prototype workspace. */
export async function setEcobankSharingConsent(granted: boolean): Promise<SharingConsentResponse> {
  if (granted) {
    return apiRequest<SharingConsentResponse>("/onboarding/share-with-ecobank", {
      method: "POST",
      body: JSON.stringify({ granted: true }),
    });
  }

  return apiRequest<SharingConsentResponse>("/onboarding/share-with-ecobank", {
    method: "DELETE",
  });
}
