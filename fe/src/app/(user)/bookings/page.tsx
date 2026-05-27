import { auth } from "@/auth";
import { getMyBookings } from "@/lib/api/private";
import { ApiHttpError } from "@/lib/api/client";
import { formatCurrencyVnd, formatDateVi } from "@/lib/format";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookingStatus } from "@/types/travel";

interface BookingsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const TABS = [
  { id: "all", label: "Tất cả" },
  { id: "PENDING", label: "Chờ xác nhận" },
  { id: "CONFIRMED", label: "Đã xác nhận" },
  { id: "CANCELLED", label: "Đã hủy" },
];

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const session = await auth();
  if (!session?.backendAccessToken) {
    redirect("/login");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentTab = typeof resolvedSearchParams.tab === "string" ? resolvedSearchParams.tab : "all";

  const bookings = await getMyBookings(session.backendAccessToken).catch((error) => {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }
    throw error;
  });

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredBookings = sortedBookings.filter((booking) => {
    if (currentTab === "all") return true;
    return booking.status === currentTab;
  });

  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case "PENDING":
        return { label: "Chờ xác nhận", color: "bg-[#fff8e6] text-[#b8860b] border-[#ffe4a0]" };
      case "CONFIRMED":
        return { label: "Đã xác nhận", color: "bg-[#e7fff3] text-[#0a7d59] border-[#9fdac4]" };
      case "CANCELLED":
        return { label: "Đã hủy", color: "bg-[#fff0f0] text-[#db2200] border-[#ffc2c2]" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-700 border-gray-300" };
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 md:space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#083b2d] md:text-4xl">Lịch sử chuyến đi</h1>
        <p className="mt-2 text-base text-[#32584c]">Quản lý các tour bạn đã đặt và theo dõi trạng thái đơn hàng.</p>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-[#cdece0] pb-px">
        {TABS.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={`/bookings?tab=${tab.id}`}
              className={`whitespace-nowrap border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-[#0a7d59] text-[#0a7d59]"
                  : "border-transparent text-[#4a7263] hover:border-[#a8d3c1] hover:text-[#0a7d59]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#a8d3c1] bg-[#f8fffb] px-6 py-16 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#e7fff4]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-10 w-10 text-[#0a7d59]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#083b2d]">Chưa có đơn đặt chỗ nào</h3>
            <p className="mt-2 max-w-md text-base text-[#32584c]">
              {currentTab === "all"
                ? "Bạn chưa thực hiện bất kỳ chuyến đi nào cùng TravelTo. Hãy khám phá các tour hấp dẫn và bắt đầu hành trình của bạn ngay hôm nay!"
                : "Không tìm thấy đơn đặt chỗ nào phù hợp với trạng thái này."}
            </p>
            {currentTab === "all" && (
              <Link
                href="/tours"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#0a7d59] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#0a7d59]/20 transition hover:-translate-y-0.5 hover:bg-[#085a41]"
              >
                Khám phá tour ngay
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);

              return (
                <article
                  key={booking.id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-[#cdece0] bg-white shadow-sm transition hover:shadow-md md:flex-row"
                >
                  {/* Left Side: Summary / Status (Acts like ticket stub) */}
                  <div className="flex flex-col justify-center border-[#cdece0] border-dashed bg-[#f8fffb] p-6 md:w-[280px] md:border-r">
                    <span
                      className={`inline-flex items-center self-start rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-[#4a7263]">Mã đặt chỗ</p>
                      <p className="mt-1 font-mono text-xl font-bold text-[#083b2d]">
                        BK-{booking.id.toString().padStart(6, "0")}
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-[#4a7263]">Ngày tạo đơn</p>
                      <p className="mt-1 text-base font-semibold text-[#1e483a]">{formatDateVi(booking.createdAt)}</p>
                    </div>
                  </div>

                  {/* Right Side: Main Details */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex-1">
                      <h3 className="line-clamp-2 text-2xl font-bold leading-tight text-[#083b2d]">
                        {booking.tourTitle}
                      </h3>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0a7d59]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                          />
                        </svg>
                        {booking.provinceName}
                      </p>

                      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-[#d9efe6] bg-[#f0fff7] p-3">
                          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4a7263]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="h-4 w-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                              />
                            </svg>
                            Ngày khởi hành
                          </div>
                          <p className="mt-1 text-base font-bold text-[#1e483a]">
                            {formatDateVi(booking.travelDate)}
                          </p>
                        </div>
                        <div className="rounded-xl border border-[#d9efe6] bg-[#f0fff7] p-3">
                          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4a7263]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="h-4 w-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                              />
                            </svg>
                            Số lượng khách
                          </div>
                          <p className="mt-1 text-base font-bold text-[#1e483a]">{booking.guests} khách</p>
                        </div>
                        <div className="col-span-2 rounded-xl border border-[#f2d5a7] bg-[#fff8eb] p-3 sm:col-span-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6a4a22]">
                            Tổng thanh toán
                          </div>
                          <p className="mt-1 text-xl font-bold text-[#db2200]">
                            {formatCurrencyVnd(booking.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end border-t border-[#eafbf3] pt-5">
                      <Link
                        href={`/tours/${booking.tourId}`}
                        className="inline-flex items-center justify-center rounded-xl border-2 border-[#0a7d59] bg-white px-5 py-2.5 text-sm font-bold text-[#0a7d59] transition hover:bg-[#e7fff4]"
                      >
                        Xem chi tiết tour
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
