"use server";

import { auth } from "@/auth";
import { ApiHttpError } from "@/lib/api/client";
import {
  createAdminTour,
  createAdminTourDeparture,
  deleteAdminTour,
  deleteAdminTourDeparture,
  updateAdminTour,
  updateAdminTourDeparture,
} from "@/lib/api/private";
import { AdminTourDepartureUpsertPayload, AdminTourUpsertPayload, TourStatus } from "@/types/travel";
import { redirect } from "next/navigation";

function parseImageUrls(raw: string): string[] {
  return raw
    .split(/\r?\n/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function sanitizeStatus(value: string): TourStatus {
  return value === "DRAFT" ? "DRAFT" : "PUBLISHED";
}

function toNumber(value: FormDataEntryValue | null): number {
  return Number(String(value ?? ""));
}

function parseTourPayload(formData: FormData): AdminTourUpsertPayload | null {
  const provinceCode = String(formData.get("provinceCode") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const departureLocation = String(formData.get("departureLocation") ?? "").trim();
  const destinationLocation = String(formData.get("destinationLocation") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const imageUrls = parseImageUrls(String(formData.get("imageUrls") ?? ""));

  const price = toNumber(formData.get("price"));
  const days = toNumber(formData.get("days"));
  const nights = toNumber(formData.get("nights"));

  if (!provinceCode || !title || !summary || !description || !departureLocation || !destinationLocation) {
    return null;
  }

  if (!Number.isFinite(price) || !Number.isFinite(days) || !Number.isFinite(nights)) {
    return null;
  }

  if (price <= 0 || days < 1 || nights < 0) {
    return null;
  }

  return {
    provinceCode,
    title,
    summary,
    description,
    price,
    days,
    nights,
    imageUrl,
    imageUrls,
    departureLocation,
    destinationLocation,
    attractions: String(formData.get("attractions") ?? "").trim(),
    cuisine: String(formData.get("cuisine") ?? "").trim(),
    suitableFor: String(formData.get("suitableFor") ?? "").trim(),
    idealTime: String(formData.get("idealTime") ?? "").trim(),
    transport: String(formData.get("transport") ?? "").trim(),
    promotion: String(formData.get("promotion") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
    status: sanitizeStatus(String(formData.get("status") ?? "PUBLISHED")),
  };
}

function redirectWithError(basePath: string, message: string) {
  const encoded = encodeURIComponent(message);
  redirect(`${basePath}${basePath.includes("?") ? "&" : "?"}error=${encoded}`);
}

function parseDeparturePayload(formData: FormData): AdminTourDepartureUpsertPayload | null {
  const departureDate = String(formData.get("departureDate") ?? "").trim();
  const returnDate = String(formData.get("returnDate") ?? "").trim();

  const price = toNumber(formData.get("price"));
  const slotsTotal = toNumber(formData.get("slotsTotal"));
  const slotsAvailable = toNumber(formData.get("slotsAvailable"));

  if (!departureDate || !returnDate) {
    return null;
  }

  if (!Number.isFinite(price) || !Number.isFinite(slotsTotal) || !Number.isFinite(slotsAvailable)) {
    return null;
  }

  if (price <= 0 || slotsTotal < 1 || slotsAvailable < 0 || slotsAvailable > slotsTotal) {
    return null;
  }

  return {
    departureDate,
    returnDate,
    price,
    slotsTotal,
    slotsAvailable,
  };
}

async function requireAdminSession() {
  const session = await auth();
  const token = session?.backendAccessToken;
  if (!token || session.user?.role !== "ADMIN") {
    redirect("/");
  }
  return token;
}

export async function createAdminTourAction(formData: FormData) {
  const token = await requireAdminSession();

  const payload = parseTourPayload(formData);
  if (!payload) {
    redirect("/admin/tours/new?error=invalid-form");
  }

  try {
    const created = await createAdminTour(token, payload);
    redirect(`/admin/tours/${created.id}?saved=1`);
  } catch (error) {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }

    const message = error instanceof ApiHttpError ? error.message : "Không thể tạo tour";
    redirectWithError("/admin/tours/new", message);
  }
}

export async function updateAdminTourAction(formData: FormData) {
  const token = await requireAdminSession();

  const tourId = toNumber(formData.get("tourId"));
  if (!Number.isFinite(tourId) || tourId <= 0) {
    redirect("/admin/tours?error=invalid-tour-id");
  }

  const payload = parseTourPayload(formData);
  if (!payload) {
    redirect(`/admin/tours/${tourId}?mode=edit&error=invalid-form`);
  }

  try {
    const updated = await updateAdminTour(token, tourId, payload);
    redirect(`/admin/tours/${updated.id}?updated=1`);
  } catch (error) {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }

    const message = error instanceof ApiHttpError ? error.message : "Không thể cập nhật tour";
    redirectWithError(`/admin/tours/${tourId}?mode=edit`, message);
  }
}

export async function deleteAdminTourAction(formData: FormData) {
  const token = await requireAdminSession();

  const tourId = toNumber(formData.get("tourId"));
  if (!Number.isFinite(tourId) || tourId <= 0) {
    redirect("/admin/tours?error=invalid-tour-id");
  }

  try {
    await deleteAdminTour(token, tourId);
    redirect("/admin/tours?deleted=1");
  } catch (error) {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }

    const message = error instanceof ApiHttpError ? error.message : "Không thể xóa tour";
    redirectWithError("/admin/tours", message);
  }
}

export async function createAdminDepartureAction(formData: FormData) {
  const token = await requireAdminSession();

  const tourId = toNumber(formData.get("tourId"));
  if (!Number.isFinite(tourId) || tourId <= 0) {
    redirect("/admin/tours?error=invalid-tour-id");
  }

  const payload = parseDeparturePayload(formData);
  if (!payload) {
    redirect(`/admin/tours/${tourId}?error=invalid-departure-form`);
  }

  try {
    await createAdminTourDeparture(token, tourId, payload);
    redirect(`/admin/tours/${tourId}?departureSaved=1`);
  } catch (error) {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }

    const message = error instanceof ApiHttpError ? error.message : "Không thể thêm đợt khởi hành";
    redirectWithError(`/admin/tours/${tourId}`, message);
  }
}

export async function updateAdminDepartureAction(formData: FormData) {
  const token = await requireAdminSession();

  const tourId = toNumber(formData.get("tourId"));
  const departureId = toNumber(formData.get("departureId"));
  if (!Number.isFinite(tourId) || tourId <= 0 || !Number.isFinite(departureId) || departureId <= 0) {
    redirect("/admin/tours?error=invalid-tour-id");
  }

  const payload = parseDeparturePayload(formData);
  if (!payload) {
    redirect(`/admin/tours/${tourId}?error=invalid-departure-form`);
  }

  try {
    await updateAdminTourDeparture(token, tourId, departureId, payload);
    redirect(`/admin/tours/${tourId}?departureUpdated=1`);
  } catch (error) {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }

    const message = error instanceof ApiHttpError ? error.message : "Không thể cập nhật đợt khởi hành";
    redirectWithError(`/admin/tours/${tourId}`, message);
  }
}

export async function deleteAdminDepartureAction(formData: FormData) {
  const token = await requireAdminSession();

  const tourId = toNumber(formData.get("tourId"));
  const departureId = toNumber(formData.get("departureId"));
  if (!Number.isFinite(tourId) || tourId <= 0 || !Number.isFinite(departureId) || departureId <= 0) {
    redirect("/admin/tours?error=invalid-tour-id");
  }

  try {
    await deleteAdminTourDeparture(token, tourId, departureId);
    redirect(`/admin/tours/${tourId}?departureDeleted=1`);
  } catch (error) {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }

    const message = error instanceof ApiHttpError ? error.message : "Không thể xóa đợt khởi hành";
    redirectWithError(`/admin/tours/${tourId}`, message);
  }
}
