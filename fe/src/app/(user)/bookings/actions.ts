"use server";

import { auth } from "@/auth";
import { submitOrder } from "@/lib/api/private";
import { ApiHttpError } from "@/lib/api/client";
import { redirect } from "next/navigation";

export async function createBookingAction(formData: FormData) {
  const session = await auth();
  if (!session?.backendAccessToken) {
    redirect("/login");
  }

  const tourId = Number(formData.get("tourId"));
  const departureId = Number(formData.get("departureId"));
  const guests = Number(formData.get("guests") ?? "1");

  if (!tourId || Number.isNaN(tourId) || !departureId || Number.isNaN(departureId) || guests < 1) {
    redirect("/bookings?error=invalid");
  }

  let paymentUrl = "";
  try {
    const response = await submitOrder(session.backendAccessToken, {
      tourId,
      departureId,
      guests,
    });
    paymentUrl = response.paymentUrl;
  } catch (error) {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }
    redirect("/bookings?error=create-failed");
  }

  if (paymentUrl) {
    redirect(paymentUrl);
  } else {
    redirect("/bookings?error=payment-url-missing");
  }
}
