import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { signOutAction } from "@/lib/auth-actions";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();
  if (!session?.backendAccessToken || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="app-shell min-h-screen">
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <header className="rounded-3xl border border-[#cdece0] bg-white px-5 py-4 shadow-[0_20px_45px_rgba(9,88,61,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0a7d59]">TravelTo Admin</p>
              <h1 className="mt-1 text-2xl font-semibold text-[#083b2d]">Khu vực quản trị hệ thống</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-2xl border border-[#cdece0] bg-[#f3fff9] px-4 py-2 text-right text-xs text-[#245547]">
                <span className="font-semibold text-[#0d3d30]">{session.user?.name || session.user?.email}</span>
                <span className="opacity-80 ml-2">Admin</span>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-2xl border border-[#0a7d59] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#0a7d59] transition hover:bg-[#e6fff4]"
                >
                  Đăng xuất
                </button>
              </form>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />
          <main className="rounded-3xl border border-[#cdece0] bg-white p-5 shadow-[0_20px_45px_rgba(9,88,61,0.08)] md:p-7">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
