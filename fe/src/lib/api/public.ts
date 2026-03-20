import { PagedResponse, ProvinceOverview, TourDetail, TourFilterOptions, TourItem } from "@/types/travel";
import { apiFetch } from "@/lib/api/client";

export async function getProvinceOverview(): Promise<ProvinceOverview[]> {
  try {
    return await apiFetch<ProvinceOverview[]>("/api/v1/provinces/overview", {
      next: { revalidate: 120 },
    });
  } catch {
    return [];
  }
}

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
