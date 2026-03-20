import { auth } from "@/auth";
import { updateBookingStatusAction } from "@/app/(admin)/admin/bookings/actions";
import { getAdminBookings } from "@/lib/api/private";
import { ApiHttpError } from "@/lib/api/client";
import { formatCurrencyVnd, formatDateVi } from "@/lib/format";
import { redirect } from "next/navigation";

export default async function AdminBookingsPage() {
  const session = await auth();
  if (!session?.backendAccessToken || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const bookings = await getAdminBookings(session.backendAccessToken).catch((error) => {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }
    throw error;
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Booking Management</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#083b2d]">Quản trị booking</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#98d8c0] bg-[#f8fffb] p-6 text-sm text-[#355a4d]">
          Hiện chưa có booking nào.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article key={booking.id} className="rounded-2xl border border-[#d5ede4] bg-[#fafffd] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1 text-sm text-[#355a4d]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0a7d59]">#{booking.id}</p>
                  <h2 className="text-lg font-semibold text-[#083b2d]">{booking.tourTitle}</h2>
                  <p>Khách: {booking.customerName} ({booking.customerEmail})</p>
                  <p>Ngày đi: {formatDateVi(booking.travelDate)} · {booking.guests} khách</p>
                  <p>Tổng tiền: {formatCurrencyVnd(booking.totalPrice)}</p>
                </div>

                <form action={updateBookingStatusAction} className="flex items-end gap-2">
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-[#0a7d59]">
                    Trạng thái
                    <select
                      name="status"
                      defaultValue={booking.status}
                      className="block rounded-xl border border-[#9ed8c3] bg-white px-3 py-2 text-sm text-[#184f41]"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#0a7d59] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#085a41]"
                  >
                    Cập nhật
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
