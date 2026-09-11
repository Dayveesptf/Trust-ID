const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("trustid_token");

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let body: ApiResponse<T>;

  try {
    body = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || !body.success) {
    throw new Error(body.message || "Something went wrong.");
  }

  return body.data as T;
}

export function setAuthToken(token: string) {
  localStorage.setItem("trustid_token", token);
}

export function getAuthToken() {
  return localStorage.getItem("trustid_token");
}

export function clearAuthToken() {
  localStorage.removeItem("trustid_token");
}

export { API_URL };
