import { PagedResponse, ProvinceOverview, TourDetail, TourItem } from "@/types/travel";
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

export async function getTours(provinceCode?: string): Promise<PagedResponse<TourItem>> {
  const query = provinceCode ? `?provinceCode=${encodeURIComponent(provinceCode)}` : "";
  return apiFetch<PagedResponse<TourItem>>(`/api/v1/tours${query}`, {
    next: { revalidate: 60 },
  });
}

export async function getTourDetail(id: number): Promise<TourDetail> {
  return apiFetch<TourDetail>(`/api/v1/tours/${id}`, {
    next: { revalidate: 60 },
  });
}
