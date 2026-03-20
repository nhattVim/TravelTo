"use server";

import { auth } from "@/auth";
import { ApiHttpError } from "@/lib/api/client";
import { createAdminTour, deleteAdminTour, updateAdminTour } from "@/lib/api/private";
import { AdminTourUpsertPayload, TourStatus } from "@/types/travel";
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
    redirect("/admin/tours?mode=create&error=invalid-form");
  }

  try {
    const created = await createAdminTour(token, payload);
    redirect(`/admin/tours?tourId=${created.id}&saved=1`);
  } catch (error) {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }

    const message = error instanceof ApiHttpError ? error.message : "Không thể tạo tour";
    redirectWithError("/admin/tours?mode=create", message);
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
    redirect(`/admin/tours?mode=edit&tourId=${tourId}&error=invalid-form`);
  }

  try {
    const updated = await updateAdminTour(token, tourId, payload);
    redirect(`/admin/tours?tourId=${updated.id}&updated=1`);
  } catch (error) {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }

    const message = error instanceof ApiHttpError ? error.message : "Không thể cập nhật tour";
    redirectWithError(`/admin/tours?mode=edit&tourId=${tourId}`, message);
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
