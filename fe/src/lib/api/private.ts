import { Booking } from "@/types/travel";
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
  status: "PENDING" | "CONFIRMED" | "CANCELLED",
): Promise<Booking> {
  return apiFetch<Booking>(`/api/v1/admin/bookings/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
    cache: "no-store",
  });
}
