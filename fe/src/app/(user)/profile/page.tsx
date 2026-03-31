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
      <div className="rounded-2xl border border-dashed border-[#ff9f9f] bg-[#fff5f5] p-6 text-sm text-[#d14f4f]">
        Không thể tải thông tin cá nhân. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Profile</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#083b2d]">Thông tin cá nhân</h2>
        <p className="mt-2 text-sm text-[#355a4d]">Quản lí thông tin liên lạc và hồ sơ của bạn.</p>
      </header>
      
      <section className="max-w-xl rounded-3xl border border-[#cbeadf] bg-white p-6 shadow-[0_16px_28px_rgba(12,85,62,0.04)]">
        <ProfileForm initialProfile={profile} token={session.backendAccessToken} />
      </section>
    </div>
  );
}
