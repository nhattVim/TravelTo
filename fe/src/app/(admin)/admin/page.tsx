import Link from "next/link";
import { auth } from "@/auth";
import { getDashboardStats } from "@/lib/api/private";
import { RevenueChart } from "@/components/admin/revenue-chart";

export default async function AdminDashboardPage() {
  const session = await auth();
  const token = session?.backendAccessToken;

  let stats = null;
  if (token) {
    try {
      stats = await getDashboardStats(token);
    } catch (e) {
      console.error("Failed to fetch dashboard stats", e);
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="space-y-7">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a7d59]">Dashboard</p>
        <h2 className="mt-2 text-4xl font-semibold text-[#083b2d]">Toàn cảnh hệ thống quản trị</h2>
        <p className="mt-2 max-w-3xl text-base text-[#34594d]">
          Đây là khu vực riêng cho quản trị viên. Bạn có thể kiểm soát người dùng, tour và toàn bộ booking mà không lẫn với giao diện đặt tour của khách.
        </p>
      </section>

      {stats ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-[#cdece0] bg-[#f8fffb] p-4">
              <p className="text-sm uppercase tracking-[0.16em] text-[#0a7d59]">Tổng doanh thu</p>
              <p className="mt-2 text-3xl font-semibold text-[#083b2d]">{formatCurrency(stats.totalRevenue || 0)}</p>
            </article>
            <article className="rounded-2xl border border-[#cdece0] bg-[#f8fffb] p-4">
              <p className="text-sm uppercase tracking-[0.16em] text-[#0a7d59]">Tổng booking</p>
              <p className="mt-2 text-4xl font-semibold text-[#083b2d]">{stats.totalBookings}</p>
            </article>
            <article className="rounded-2xl border border-[#cdece0] bg-[#f8fffb] p-4">
              <p className="text-sm uppercase tracking-[0.16em] text-[#0a7d59]">Người dùng</p>
              <p className="mt-2 text-4xl font-semibold text-[#92c0ff]">{stats.totalUsers}</p>
            </article>
            <article className="rounded-2xl border border-[#cdece0] bg-[#f8fffb] p-4">
              <p className="text-sm uppercase tracking-[0.16em] text-[#0a7d59]">Tour đang mở</p>
              <p className="mt-2 text-4xl font-semibold text-[#7cf4c4]">{stats.totalTours}</p>
            </article>
          </section>

          <section>
            <RevenueChart data={stats.monthlyRevenue || []} />
          </section>
        </>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          Không thể tải dữ liệu thống kê. Vui lòng kiểm tra lại kết nối hoặc đăng nhập lại.
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-3">
        <Link href="/admin/users" className="rounded-2xl border border-[#cdece0] bg-white p-5 transition hover:border-[#9ad9bf] hover:bg-[#f5fff9]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">User Management</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#083b2d]">Quản lí user</h3>
          <p className="mt-2 text-base text-[#355a4d]">Theo dõi tài khoản, vai trò và trạng thái hoạt động theo email.</p>
        </Link>

        <Link href="/admin/tours" className="rounded-2xl border border-[#cdece0] bg-white p-5 transition hover:border-[#9ad9bf] hover:bg-[#f5fff9]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Tour Management</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#083b2d]">Quản lí tour</h3>
          <p className="mt-2 text-base text-[#355a4d]">Xem tồn chỗ, cấu trúc tuyến và kiểm tra chất lượng dữ liệu tour.</p>
        </Link>

        <Link href="/admin/bookings" className="rounded-2xl border border-[#cdece0] bg-white p-5 transition hover:border-[#9ad9bf] hover:bg-[#f5fff9]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Booking Management</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#083b2d]">Quản lí booking</h3>
          <p className="mt-2 text-base text-[#355a4d]">Xác nhận, theo dõi hoặc hủy đơn đặt tour của khách hàng.</p>
        </Link>
      </section>

      {stats && (
        <section className="rounded-2xl border border-[#cdece0] bg-white p-5">
          <h3 className="text-xl font-semibold text-[#083b2d]">Tình trạng booking</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-[#e1f3eb] bg-[#f7fffb] p-4">
              <p className="text-sm uppercase tracking-wide text-[#0a7d59]">Chờ xác nhận (Pending)</p>
              <p className="mt-1 text-3xl font-semibold text-[#ffd166]">{stats.pendingBookings}</p>
            </div>
            <div className="rounded-xl border border-[#e1f3eb] bg-[#f7fffb] p-4">
              <p className="text-sm uppercase tracking-wide text-[#0a7d59]">Đã hoàn thành (Completed)</p>
              <p className="mt-1 text-3xl font-semibold text-[#78f5bf]">{stats.completedBookings}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
