import { auth } from "@/auth";
import { getAdminBookings } from "@/lib/api/private";

interface UserAggregate {
  email: string;
  name: string;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
}

export default async function AdminUsersPage() {
  const session = await auth();
  const token = session?.backendAccessToken;

  const bookings = token ? await getAdminBookings(token).catch(() => []) : [];

  const userMap = new Map<string, UserAggregate>();

  for (const booking of bookings) {
    const key = booking.customerEmail.toLowerCase();
    const existing = userMap.get(key) ?? {
      email: booking.customerEmail,
      name: booking.customerName,
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      cancelledBookings: 0,
      totalSpent: 0,
    };

    existing.totalBookings += 1;
    existing.totalSpent += booking.totalPrice;

    if (booking.status === "PENDING") {
      existing.pendingBookings += 1;
    }
    if (booking.status === "CONFIRMED") {
      existing.confirmedBookings += 1;
    }
    if (booking.status === "CANCELLED") {
      existing.cancelledBookings += 1;
    }

    userMap.set(key, existing);
  }

  const users = Array.from(userMap.values()).sort((a, b) => b.totalBookings - a.totalBookings);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">User Management</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#083b2d]">Quản lí user</h2>
        <p className="mt-2 text-sm text-[#355a4d]">
          Danh sách người dùng được tổng hợp từ dữ liệu booking hiện có. Bạn có thể theo dõi hành vi đặt tour theo từng email.
        </p>
      </header>

      <section className="rounded-2xl border border-[#cdece0] bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-[#355a4d]">Tổng user có booking: <span className="font-semibold text-[#083b2d]">{users.length}</span></p>
          <div className="rounded-xl border border-[#cdece0] bg-[#f4fff9] px-3 py-1 text-xs text-[#376050]">
            Chưa có API CRUD user riêng, đang dùng dữ liệu thực tế từ booking
          </div>
        </div>

        {users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#98d8c0] bg-[#f8fffb] p-6 text-sm text-[#355a4d]">
            Chưa có dữ liệu user để quản lí.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[#355a4d]">
              <thead>
                <tr className="border-b border-[#def1e9] text-xs uppercase tracking-wide text-[#0a7d59]">
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Total booking</th>
                  <th className="px-3 py-2">Pending</th>
                  <th className="px-3 py-2">Confirmed</th>
                  <th className="px-3 py-2">Cancelled</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email} className="border-b border-[#edf7f3] last:border-0">
                    <td className="px-3 py-3 font-medium text-[#083b2d]">{user.name || "N/A"}</td>
                    <td className="px-3 py-3">{user.email}</td>
                    <td className="px-3 py-3">{user.totalBookings}</td>
                    <td className="px-3 py-3 text-[#ffd166]">{user.pendingBookings}</td>
                    <td className="px-3 py-3 text-[#81f0c0]">{user.confirmedBookings}</td>
                    <td className="px-3 py-3 text-[#ff9f9f]">{user.cancelledBookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
