import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DeleteAccountForm } from "./delete-form";

export const metadata = {
  title: "Yêu cầu xóa tài khoản | TravelTo",
};

export default async function DeleteAccountPage() {
  const session = await auth();
  if (!session?.backendAccessToken) {
    redirect("/login");
  }

  return (
    <div className="rounded-3xl border border-[#ffdbdb] bg-[#fffcfc] p-6 shadow-[0_16px_28px_rgba(209,79,79,0.04)] md:p-10">
      <DeleteAccountForm token={session.backendAccessToken} />
    </div>
  );
}
