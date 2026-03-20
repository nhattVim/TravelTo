import { AdminTourDetail, AdminTourListItem, AdminTourUpsertPayload, Booking, BookingStatus, PagedResponse } from "@/types/travel";
import { apiFetch } from "@/lib/api/client";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getMyBookings(token: string): Promise<Booking[]> {
  return apiFetch<Booking[]>("/api/v1/bookings/me", {
    headers: authHeaders(token),
    cache: "no-store",
  });
}

export async function createBooking(
  token: string,
  payload: { tourId: number; departureId: number; guests: number },
): Promise<Booking> {
  return apiFetch<Booking>("/api/v1/bookings", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function getAdminBookings(token: string): Promise<Booking[]> {
  return apiFetch<Booking[]>("/api/v1/admin/bookings", {
    headers: authHeaders(token),
    cache: "no-store",
  });
}

export async function updateBookingStatus(
  token: string,
  id: number,
  status: BookingStatus,
): Promise<Booking> {
  return apiFetch<Booking>(`/api/v1/admin/bookings/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
    cache: "no-store",
  });
}

export async function getAdminTours(
  token: string,
  params?: { page?: number; size?: number },
): Promise<PagedResponse<AdminTourListItem>> {
  const searchParams = new URLSearchParams();
  if (typeof params?.page === "number") {
    searchParams.set("page", String(params.page));
  }
  if (typeof params?.size === "number") {
    searchParams.set("size", String(params.size));
  }

  const query = searchParams.toString();
  const path = query ? `/api/v1/admin/tours?${query}` : "/api/v1/admin/tours";

  return apiFetch<PagedResponse<AdminTourListItem>>(path, {
    headers: authHeaders(token),
    cache: "no-store",
  });
}

export async function getAdminTourDetail(token: string, id: number): Promise<AdminTourDetail> {
  return apiFetch<AdminTourDetail>(`/api/v1/admin/tours/${id}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
}

export async function createAdminTour(token: string, payload: AdminTourUpsertPayload): Promise<AdminTourDetail> {
  return apiFetch<AdminTourDetail>("/api/v1/admin/tours", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function updateAdminTour(
  token: string,
  id: number,
  payload: AdminTourUpsertPayload,
): Promise<AdminTourDetail> {
  return apiFetch<AdminTourDetail>(`/api/v1/admin/tours/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function deleteAdminTour(token: string, id: number): Promise<void> {
  return apiFetch<void>(`/api/v1/admin/tours/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
    cache: "no-store",
  });
}
