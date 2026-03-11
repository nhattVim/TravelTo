import { auth } from "@/auth";
import { createBookingAction } from "@/app/(user)/bookings/actions";
import { getMyBookings } from "@/lib/api/private";
import { getTourDetail } from "@/lib/api/public";
import { formatCurrencyVnd, formatDateVi } from "@/lib/format";
import { redirect } from "next/navigation";

interface BookingsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const session = await auth();
  if (!session?.backendAccessToken) {
    redirect("/login");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const tourIdParam =
    typeof resolvedSearchParams.tourId === "string" ? Number(resolvedSearchParams.tourId) : undefined;

  const [bookings, selectedTour] = await Promise.all([
    getMyBookings(session.backendAccessToken),
    tourIdParam && !Number.isNaN(tourIdParam) ? getTourDetail(tourIdParam).catch(() => null) : Promise.resolve(null),
  ]);

  const isSuccess = resolvedSearchParams.success === "1";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">My Booking</p>
        <h1 className="mt-2 text-3xl font-bold text-[#083b2d]">Quản lý đặt tour của bạn</h1>
      </div>

      {isSuccess ? (
        <div className="rounded-2xl border border-[#7dd2b1] bg-[#e7fff3] px-5 py-4 text-sm font-medium text-[#0b6448]">
          Đặt tour thành công. Đơn của bạn đang ở trạng thái chờ xác nhận.
        </div>
      ) : null}

      {selectedTour ? (
        <section className="rounded-3xl border border-[#cdece0] bg-white p-6 md:p-8">
          <h2 className="text-xl font-semibold text-[#0b3c2e]">Đặt tour: {selectedTour.title}</h2>
          <p className="mt-1 text-sm text-[#2e5a4c]">{selectedTour.provinceName} · {formatCurrencyVnd(selectedTour.price)}</p>
          <form action={createBookingAction} className="mt-5 grid gap-4 md:grid-cols-3">
            <input type="hidden" name="tourId" value={selectedTour.id} />
            <label className="space-y-2 text-sm text-[#284f42]">
              <span>Ngày khởi hành</span>
              <input
                type="date"
                name="travelDate"
                required
                className="w-full rounded-xl border border-[#9fdac4] bg-white px-3 py-2 outline-none focus:border-[#0a7d59]"
              />
            </label>
            <label className="space-y-2 text-sm text-[#284f42]">
              <span>Số khách</span>
              <input
                type="number"
                name="guests"
                min={1}
                defaultValue={1}
                required
                className="w-full rounded-xl border border-[#9fdac4] bg-white px-3 py-2 outline-none focus:border-[#0a7d59]"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-[#0a7d59] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#085a41]"
              >
                Xác nhận đặt tour
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#083b2d]">Lịch sử booking</h2>
        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#8ed5be] bg-white p-6 text-sm text-[#2f5b4e]">
            Bạn chưa có booking nào.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-2xl border border-[#d3ede3] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0a7d59]">{booking.status}</p>
                <h3 className="mt-2 text-lg font-semibold text-[#093c2d]">{booking.tourTitle}</h3>
                <p className="mt-1 text-sm text-[#32584c]">{booking.provinceName}</p>
                <div className="mt-4 space-y-1 text-sm text-[#2c564a]">
                  <p>Ngày đi: {formatDateVi(booking.travelDate)}</p>
                  <p>Số khách: {booking.guests}</p>
                  <p>Tổng tiền: {formatCurrencyVnd(booking.totalPrice)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
