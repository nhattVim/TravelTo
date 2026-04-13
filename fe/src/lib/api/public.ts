import { PagedResponse, TourDetail, TourFilterOptions, TourItem } from "@/types/travel";
import { apiFetch } from "@/lib/api/client";

export async function getHighlights(): Promise<TourItem[]> {
  try {
    return await apiFetch<TourItem[]>("/api/v1/home/highlights", {
      next: { revalidate: 120 },
    });
  } catch {
    return [];
  }
}

export async function getTours(filters?: {
  provinceCode?: string;
  departureLocation?: string;
  destinationLocation?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
}): Promise<PagedResponse<TourItem>> {
  const searchParams = new URLSearchParams();

  if (filters?.provinceCode) {
    searchParams.set("provinceCode", filters.provinceCode);
  }

  if (filters?.departureLocation) {
    searchParams.set("departureLocation", filters.departureLocation);
  }

  if (filters?.destinationLocation) {
    searchParams.set("destinationLocation", filters.destinationLocation);
  }

  if (filters?.minPrice) {
    searchParams.set("minPrice", filters.minPrice.toString());
  }

  if (filters?.maxPrice) {
    searchParams.set("maxPrice", filters.maxPrice.toString());
  }

  const query = searchParams.toString();
  const path = query ? `/api/v1/tours?${query}` : "/api/v1/tours";

  return apiFetch<PagedResponse<TourItem>>(path, {
    next: { revalidate: 60 },
  });
}

export async function getTourFilterOptions(): Promise<TourFilterOptions> {
  try {
    return await apiFetch<TourFilterOptions>("/api/v1/tours/filters", {
      next: { revalidate: 300 },
    });
  } catch {
    return {
      departureLocations: [],
      destinationLocations: [],
    };
  }
}

export async function getTourDetail(id: number): Promise<TourDetail> {
  return apiFetch<TourDetail>(`/api/v1/tours/${id}`, {
    next: { revalidate: 60 },
  });
}

export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordWithOtp(email: string, otp: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>("/api/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, code: otp, newPassword, confirmPassword }),
  });
}
