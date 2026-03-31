import {
  AdminTourDepartureUpsertPayload,
  AdminTourDetail,
  AdminTourListItem,
  AdminTourUpsertPayload,
  Booking,
  BookingStatus,
  PagedResponse,
  TourDeparture,
  UserDto,
  UserProfileDto,
  UserProfileUpdateRequest,
  UserRole,
  WishlistDto,
} from "@/types/travel";
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

export async function createAdminTourDeparture(
  token: string,
  tourId: number,
  payload: AdminTourDepartureUpsertPayload,
): Promise<TourDeparture> {
  return apiFetch<TourDeparture>(`/api/v1/admin/tours/${tourId}/departures`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function updateAdminTourDeparture(
  token: string,
  tourId: number,
  departureId: number,
  payload: AdminTourDepartureUpsertPayload,
): Promise<TourDeparture> {
  return apiFetch<TourDeparture>(`/api/v1/admin/tours/${tourId}/departures/${departureId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function deleteAdminTourDeparture(
  token: string,
  tourId: number,
  departureId: number,
): Promise<void> {
  return apiFetch<void>(`/api/v1/admin/tours/${tourId}/departures/${departureId}`, {
    method: "DELETE",
    headers: authHeaders(token),
    cache: "no-store",
  });
}

// User Profile
export async function getUserProfile(token: string): Promise<UserProfileDto> {
  return apiFetch<UserProfileDto>("/api/v1/users/me", {
    headers: authHeaders(token),
    cache: "no-store",
  });
}

export async function updateUserProfile(
  token: string,
  payload: UserProfileUpdateRequest,
): Promise<UserProfileDto> {
  return apiFetch<UserProfileDto>("/api/v1/users/me", {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

// Admin Users
export async function getAdminUsers(
  token: string,
  params?: { page?: number; size?: number },
): Promise<PagedResponse<UserDto>> {
  const searchParams = new URLSearchParams();
  if (typeof params?.page === "number") searchParams.set("page", String(params.page));
  if (typeof params?.size === "number") searchParams.set("size", String(params.size));
  const query = searchParams.toString();
  const path = query ? `/api/v1/admin/users?${query}` : "/api/v1/admin/users";
  return apiFetch<PagedResponse<UserDto>>(path, {
    headers: authHeaders(token),
    cache: "no-store",
  });
}

export async function updateAdminUserRole(
  token: string,
  id: number,
  role: UserRole,
): Promise<UserDto> {
  return apiFetch<UserDto>(`/api/v1/admin/users/${id}/role`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ role }),
    cache: "no-store",
  });
}

// Wishlists
export async function getMyWishlists(
  token: string,
  params?: { page?: number; size?: number },
): Promise<PagedResponse<WishlistDto>> {
  const searchParams = new URLSearchParams();
  if (typeof params?.page === "number") searchParams.set("page", String(params.page));
  if (typeof params?.size === "number") searchParams.set("size", String(params.size));
  const query = searchParams.toString();
  const path = query ? `/api/v1/wishlists?${query}` : "/api/v1/wishlists";
  return apiFetch<PagedResponse<WishlistDto>>(path, {
    headers: authHeaders(token),
    cache: "no-store",
  });
}

export async function addWishlist(token: string, tourId: number): Promise<void> {
  return apiFetch<void>(`/api/v1/wishlists/tours/${tourId}`, {
    method: "POST",
    headers: authHeaders(token),
    cache: "no-store",
  });
}

export async function removeWishlist(token: string, tourId: number): Promise<void> {
  return apiFetch<void>(`/api/v1/wishlists/tours/${tourId}`, {
    method: "DELETE",
    headers: authHeaders(token),
    cache: "no-store",
  });
}

export async function checkWishlistStatus(token: string, tourId: number): Promise<{ isWished: boolean }> {
  return apiFetch<{ isWished: boolean }>(`/api/v1/wishlists/tours/${tourId}/status`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
}
