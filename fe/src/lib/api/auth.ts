import { BackendAuthResponse } from "@/types/travel";
import { apiFetch } from "@/lib/api/client";

export function exchangeGoogleToken(idToken: string): Promise<BackendAuthResponse> {
  return apiFetch<BackendAuthResponse>("/api/v1/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
    cache: "no-store",
  });
}
