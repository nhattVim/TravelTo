"use server";

import { auth } from "@/auth";
import { updateBookingStatus } from "@/lib/api/private";
import { ApiHttpError } from "@/lib/api/client";
import { redirect } from "next/navigation";

export async function updateBookingStatusAction(formData: FormData) {
  const session = await auth();

  if (!session?.backendAccessToken || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const id = Number(formData.get("bookingId"));
  const status = String(formData.get("status") ?? "PENDING") as "PENDING" | "CONFIRMED" | "CANCELLED";

  if (!id || Number.isNaN(id)) {
    redirect("/admin/bookings?error=invalid");
  }

  try {
    await updateBookingStatus(session.backendAccessToken, id, status);
  } catch (error) {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }
    redirect("/admin/bookings?error=update-failed");
  }

  redirect("/admin/bookings?updated=1");
}
