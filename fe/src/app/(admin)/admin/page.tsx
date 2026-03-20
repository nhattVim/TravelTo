import Link from "next/link";
import { auth } from "@/auth";
import { getAdminBookings } from "@/lib/api/private";
import { getTours } from "@/lib/api/public";

export default async function AdminDashboardPage() {
  const session = await auth();
  const token = session?.backendAccessToken;

  const [bookings, tours] = await Promise.all([
    token ? getAdminBookings(token).catch(() => []) : Promise.resolve([]),
    getTours().catch(() => ({ items: [], totalElements: 0, totalPages: 0, page: 0, size: 9 })),
  ]);

  const pendingCount = bookings.filter((item) => item.status === "PENDING").length;
  const confirmedCount = bookings.filter((item) => item.status === "CONFIRMED").length;
  const cancelledCount = bookings.filter((item) => item.status === "CANCELLED").length;
  const uniqueCustomerCount = new Set(bookings.map((item) => item.customerEmail.toLowerCase())).size;

  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0a7d59]">Dashboard</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#083b2d]">Toàn cảnh hệ thống quản trị</h2>
        <p className="mt-2 max-w-3xl text-sm text-[#34594d]">
          Đây là khu vực riêng cho quản trị viên. Bạn có thể kiểm soát người dùng, tour và toàn bộ booking mà không lẫn với giao diện đặt tour của khách.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[#cdece0] bg-[#f8fffb] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[#0a7d59]">Tổng booking</p>
          <p className="mt-2 text-3xl font-semibold text-[#083b2d]">{bookings.length}</p>
        </article>
        <article className="rounded-2xl border border-[#cdece0] bg-[#f8fffb] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[#0a7d59]">Booking chờ xử lí</p>
          <p className="mt-2 text-3xl font-semibold text-[#ffd166]">{pendingCount}</p>
        </article>
        <article className="rounded-2xl border border-[#cdece0] bg-[#f8fffb] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[#0a7d59]">Tour đang mở</p>
          <p className="mt-2 text-3xl font-semibold text-[#7cf4c4]">{tours.totalElements}</p>
        </article>
        <article className="rounded-2xl border border-[#cdece0] bg-[#f8fffb] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[#0a7d59]">Khách hàng phát sinh đơn</p>
          <p className="mt-2 text-3xl font-semibold text-[#92c0ff]">{uniqueCustomerCount}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Link href="/admin/users" className="rounded-2xl border border-[#cdece0] bg-white p-5 transition hover:border-[#9ad9bf] hover:bg-[#f5fff9]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">User Management</p>
          <h3 className="mt-2 text-xl font-semibold text-[#083b2d]">Quản lí user</h3>
          <p className="mt-2 text-sm text-[#355a4d]">Theo dõi tài khoản, vai trò và trạng thái hoạt động theo email.</p>
        </Link>

        <Link href="/admin/tours" className="rounded-2xl border border-[#cdece0] bg-white p-5 transition hover:border-[#9ad9bf] hover:bg-[#f5fff9]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Tour Management</p>
          <h3 className="mt-2 text-xl font-semibold text-[#083b2d]">Quản lí tour</h3>
          <p className="mt-2 text-sm text-[#355a4d]">Xem tồn chỗ, cấu trúc tuyến và kiểm tra chất lượng dữ liệu tour.</p>
        </Link>

        <Link href="/admin/bookings" className="rounded-2xl border border-[#cdece0] bg-white p-5 transition hover:border-[#9ad9bf] hover:bg-[#f5fff9]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Booking Management</p>
          <h3 className="mt-2 text-xl font-semibold text-[#083b2d]">Quản lí booking</h3>
          <p className="mt-2 text-sm text-[#355a4d]">Xác nhận, theo dõi hoặc hủy đơn đặt tour của khách hàng.</p>
        </Link>
      </section>

      <section className="rounded-2xl border border-[#cdece0] bg-white p-5">
        <h3 className="text-lg font-semibold text-[#083b2d]">Tình trạng booking</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-[#e1f3eb] bg-[#f7fffb] p-4">
            <p className="text-xs uppercase tracking-wide text-[#0a7d59]">Pending</p>
            <p className="mt-1 text-2xl font-semibold text-[#ffd166]">{pendingCount}</p>
          </div>
          <div className="rounded-xl border border-[#e1f3eb] bg-[#f7fffb] p-4">
            <p className="text-xs uppercase tracking-wide text-[#0a7d59]">Confirmed</p>
            <p className="mt-1 text-2xl font-semibold text-[#78f5bf]">{confirmedCount}</p>
          </div>
          <div className="rounded-xl border border-[#e1f3eb] bg-[#f7fffb] p-4">
            <p className="text-xs uppercase tracking-wide text-[#0a7d59]">Cancelled</p>
            <p className="mt-1 text-2xl font-semibold text-[#ff9f9f]">{cancelledCount}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
