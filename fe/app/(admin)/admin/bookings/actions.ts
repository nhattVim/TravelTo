"use server";

import { auth } from "@/auth";
import { updateBookingStatus } from "@/lib/api/private";
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

  await updateBookingStatus(session.backendAccessToken, id, status);
  redirect("/admin/bookings?updated=1");
}
