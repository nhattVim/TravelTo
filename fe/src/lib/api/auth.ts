import { BackendAuthResponse } from "@/types/travel";
import { apiFetch } from "@/lib/api/client";

export function exchangeGoogleToken(idToken: string): Promise<BackendAuthResponse> {
  return apiFetch<BackendAuthResponse>("/api/v1/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
    cache: "no-store",
  });
}

export function loginWithEmailPassword(email: string, password: string): Promise<BackendAuthResponse> {
  return apiFetch<BackendAuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
}

export function createPassword(token: string, password: string): Promise<void> {
  return apiFetch<void>("/api/v1/auth/password", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
    cache: "no-store",
  });
}
