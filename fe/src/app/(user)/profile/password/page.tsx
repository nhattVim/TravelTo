import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PasswordForm } from "./password-form";

export const metadata = {
  title: "Đổi mật khẩu | TravelTo",
};

export default async function PasswordPage() {
  const session = await auth();
  if (!session?.backendAccessToken) {
    redirect("/login");
  }

  return (
    <div className="rounded-3xl border border-[#cbeadf] bg-white p-6 shadow-[0_16px_28px_rgba(12,85,62,0.04)] md:p-10">
      <PasswordForm token={session.backendAccessToken} />
    </div>
  );
}
