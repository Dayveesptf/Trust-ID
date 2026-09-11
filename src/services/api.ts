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

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Unable to connect to the TrustID server. Please check your connection and try again."
    );
  }

  let body: ApiResponse<T> | null = null;

  try {
    body = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(
        `Server error (${response.status}). Please try again.`
      );
    }

    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || !body?.success) {
    if (response.status === 401) {
      localStorage.removeItem("trustid_token");
    }

    throw new Error(
      body?.message ||
        `Request failed with status ${response.status}.`
    );
  }

  return body.data as T;
}

export function setAuthToken(token: string) {
  localStorage.setItem("trustid_token", token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem("trustid_token");
}

export function clearAuthToken() {
  localStorage.removeItem("trustid_token");
}

export { API_URL };