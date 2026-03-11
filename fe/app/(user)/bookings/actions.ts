"use server";

import { auth } from "@/auth";
import { createBooking } from "@/lib/api/private";
import { redirect } from "next/navigation";

export async function createBookingAction(formData: FormData) {
  const session = await auth();
  if (!session?.backendAccessToken) {
    redirect("/login");
  }

  const tourId = Number(formData.get("tourId"));
  const travelDate = String(formData.get("travelDate") ?? "");
  const guests = Number(formData.get("guests") ?? "1");

  if (!tourId || Number.isNaN(tourId) || !travelDate || guests < 1) {
    redirect("/bookings?error=invalid");
  }

  await createBooking(session.backendAccessToken, {
    tourId,
    travelDate,
    guests,
  });

  redirect("/bookings?success=1");
}
