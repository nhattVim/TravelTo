"use server";

import { auth } from "@/auth";
import { createPassword } from "@/lib/api/auth";
import { ApiHttpError } from "@/lib/api/client";
import { redirect } from "next/navigation";

export async function createPasswordAction(formData: FormData) {
  const session = await auth();

  if (!session?.backendAccessToken) {
    redirect("/login");
  }

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8 || password.length > 72) {
    redirect("/set-password?error=length");
  }

  if (password !== confirmPassword) {
    redirect("/set-password?error=mismatch");
  }

  try {
    await createPassword(session.backendAccessToken, password);
  } catch (error) {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }
    redirect("/set-password?error=failed");
  }

  if (session.user?.role === "ADMIN") {
    redirect("/admin");
  }

  redirect("/?password-set=1");
}
