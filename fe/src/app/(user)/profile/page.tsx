import { auth } from "@/auth";
import { getUserProfile } from "@/lib/api/private";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";

export const metadata = {
  title: "Thông tin cá nhân | TravelTo",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.backendAccessToken) {
    redirect("/login");
  }

  const profile = await getUserProfile(session.backendAccessToken).catch(() => null);

  if (!profile) {
    return (
      <div className="rounded-2xl border border-dashed border-[#ff9f9f] bg-[#fff5f5] p-6 text-base text-[#d14f4f]">
        Không thể tải thông tin cá nhân. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#cbeadf] bg-white p-6 md:p-10 shadow-[0_16px_28px_rgba(12,85,62,0.04)]">
      <ProfileForm initialProfile={profile} token={session.backendAccessToken} />
    </div>
  );
}
