import {
  apiRequest,
  clearAuthToken,
  setAuthToken,
} from "./api";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "USER" | "ECOBANK_OFFICER" | "ADMIN";
  onboardingCompleted: boolean;
  consent: {
    granted: boolean;
    grantedAt?: string;
    version: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerUser(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  setAuthToken(data.token);

  return data;
}

export async function loginUser(
  payload: LoginPayload
): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  setAuthToken(data.token);

  return data;
}

export async function getCurrentUser(): Promise<User> {
  const data = await apiRequest<{ user: User }>("/auth/me");

  return data.user;
}

export function logoutUser() {
  clearAuthToken();
}
