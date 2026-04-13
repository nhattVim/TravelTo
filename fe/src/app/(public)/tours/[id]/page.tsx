import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrencyVnd, formatDateVi } from "@/lib/format";
import { getTourDetail } from "@/lib/api/public";
import { TourDepartureCalendar } from "@/components/tours/tour-departure-calendar";
import { TourImageSlider } from "@/components/tours/tour-image-slider";
import { auth } from "@/auth";
import { checkWishlistStatus } from "@/lib/api/private";
import { FavoriteButton } from "@/components/tours/favorite-button";

interface TourDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function TourDetailPage({ params, searchParams }: TourDetailPageProps) {
  const { id } = await params;
  const numericId = Number(id);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const dateFromUrl = typeof resolvedSearchParams.date === "string" ? resolvedSearchParams.date : undefined;

  if (Number.isNaN(numericId)) {
    notFound();
  }

  const tour = await getTourDetail(numericId).catch(() => null);
  if (!tour) {
    notFound();
  }

  const selectedDeparture = tour.departures?.find(d => d.departureDate === dateFromUrl) ?? null;

  const additionalInfo = tour.additionalInfo ?? {
    attractions: "",
    cuisine: "",
    suitableFor: "",
    idealTime: "",
    transport: "",
    promotion: "",
    notes: "",
  };

  const session = await auth();
  const token = session?.backendAccessToken;

  let isWished = false;
  if (token) {
    const status = await checkWishlistStatus(token, numericId).catch(() => ({ isWished: false }));
    isWished = status.isWished;
  }

  const galleryImages = tour.imageUrls?.length > 0 ? tour.imageUrls : [tour.imageUrl];

  return (
    <div className="space-y-8">
      <Link href="/tours" className="text-base font-semibold text-[#0a7d59] hover:underline">
        ← Quay lại danh sách tour
      </Link>

      <section className="grid gap-6 xl:grid-cols-[1fr_340px] items-start">
        <div className="space-y-8 min-w-0">
          <div className="space-y-4 rounded-3xl border border-[#cdece0] bg-white p-5 md:p-6">
            <TourImageSlider images={galleryImages} title={tour.title} />

            <div className="space-y-4">
              <p className="inline-flex rounded-full bg-[#e4fff4] px-3 py-1 text-sm font-semibold uppercase tracking-wide text-[#0a7d59]">
                {tour.provinceName}
              </p>
              <h1 className="text-4xl font-bold text-[#083b2d] md:text-5xl">{tour.title}</h1>
              <p className="text-lg text-[#34594d]">{tour.summary}</p>
              <div className="grid gap-4 rounded-2xl bg-[#f0fff7] p-5 text-base text-[#1f4f41] md:grid-cols-3">
                <p>Thời lượng: {tour.days} ngày · {tour.nights} đêm</p>
                <p>Lộ trình: {tour.departureLocation} → {tour.destinationLocation}</p>
                <p>Giá từ: {formatCurrencyVnd(tour.price)}</p>
              </div>
              <p className="leading-relaxed text-[#264f42]">{tour.description}</p>
            </div>
          </div>

          <div id="lich-khoi-hanh">
            <TourDepartureCalendar tourId={tour.id} departures={tour.departures ?? []} initialDate={dateFromUrl} />
          </div>
        </div>

        <aside className="sticky top-24 h-fit rounded-3xl border border-[#cdece0] bg-white p-5 shadow-[0_18px_30px_rgba(7,68,50,0.06)] z-10 flex flex-col">
          {selectedDeparture ? (
            <>
              <p className="text-base font-semibold text-[#0d3f30]">Giá:</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#db2200]">{formatCurrencyVnd(selectedDeparture.price)}</span>
                <span className="text-base text-[#285447] font-medium">/ Khách</span>
              </p>
              <div className="mt-6 space-y-3 border-y border-[#cdece0] py-4 text-sm text-[#285447]">
                <p className="flex justify-between items-center"><span className="text-gray-500">Mã tour:</span> <span className="font-semibold text-right max-w-[150px] truncate">{tour.provinceCode}{tour.id}</span></p>
                <p className="flex justify-between items-center"><span className="text-gray-500">Khởi hành:</span> <span className="font-semibold">{tour.departureLocation}</span></p>
                <p className="flex justify-between items-center"><span className="text-gray-500">Ngày đi:</span> <span className="font-semibold">{formatDateVi(selectedDeparture.departureDate).replace(' ngày ', ' ')}</span></p>
                <p className="flex justify-between items-center"><span className="text-gray-500">Thời gian:</span> <span className="font-semibold">{tour.days}N{tour.nights}Đ</span></p>
                <p className="flex justify-between items-center"><span className="text-gray-500">Số chỗ còn:</span> <span className="font-bold text-[#db2200]">{selectedDeparture.slotsAvailable}</span></p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <Link
                  href={`/tours/${tour.id}#lich-khoi-hanh`}
                  scroll={false}
                  className="inline-flex flex-col sm:flex-row items-center gap-1 rounded-xl border border-[#cdece0] px-3 py-3 text-sm font-semibold text-[#0d3f30] transition hover:bg-[#ebfff6]"
                  title="Chọn ngày khác"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  <span className="hidden sm:inline">Ngày khác</span>
                </Link>
                <Link
                  href={`/bookings?tourId=${tour.id}&departureId=${selectedDeparture.id}`}
                  className="flex-1 inline-flex items-center justify-center rounded-xl bg-[#db2200] px-3 py-3 text-base font-bold text-white shadow-md transition hover:bg-[#b81d00]"
                >
                  Đặt ngay
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-base font-semibold text-[#0d3f30]">Giá từ</p>
              <p className="mt-1 text-5xl font-bold text-[#db2200]">{formatCurrencyVnd(tour.price)}</p>
              <div className="mt-4 space-y-2 border-t border-[#cdece0] pt-4 text-base text-[#285447]">
                <p>Khởi hành: <span className="font-semibold">{tour.departureLocation}</span></p>
                <p>Điểm đến: <span className="font-semibold">{tour.destinationLocation}</span></p>
                <p>Số chỗ toàn tour: <span className="font-semibold">{tour.slotsAvailable}</span></p>
              </div>

              <a
                href="#lich-khoi-hanh"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#0a7d59] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#085a41]"
              >
                Chọn ngày khởi hành
              </a>
              <div className="mt-4">
                <FavoriteButton
                  tourId={tour.id}
                  initialIsWished={isWished}
                  token={token}
                />
              </div>
            </>
          )}
        </aside>
      </section>

      <section className="space-y-6 rounded-3xl border border-[#cdece0] bg-white p-6 md:p-8">
        <h2 className="text-4xl font-bold text-[#083b2d]">Thông tin thêm về chuyến đi</h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl border border-[#d9efe6] bg-[#f8fffb] p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Điểm tham quan</p>
            <p className="mt-2 text-base text-[#2f5b4d]">{additionalInfo.attractions || "Đang cập nhật"}</p>
          </article>
          <article className="rounded-2xl border border-[#d9efe6] bg-[#f8fffb] p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Ẩm thực</p>
            <p className="mt-2 text-base text-[#2f5b4d]">{additionalInfo.cuisine || "Đang cập nhật"}</p>
          </article>
          <article className="rounded-2xl border border-[#d9efe6] bg-[#f8fffb] p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Đối tượng phù hợp</p>
            <p className="mt-2 text-base text-[#2f5b4d]">{additionalInfo.suitableFor || "Đang cập nhật"}</p>
          </article>
          <article className="rounded-2xl border border-[#d9efe6] bg-[#f8fffb] p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Thời gian lý tưởng</p>
            <p className="mt-2 text-base text-[#2f5b4d]">{additionalInfo.idealTime || "Đang cập nhật"}</p>
          </article>
          <article className="rounded-2xl border border-[#d9efe6] bg-[#f8fffb] p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Phương tiện</p>
            <p className="mt-2 text-base text-[#2f5b4d]">{additionalInfo.transport || "Đang cập nhật"}</p>
          </article>
          <article className="rounded-2xl border border-[#d9efe6] bg-[#f8fffb] p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Khuyến mãi</p>
            <p className="mt-2 text-base text-[#2f5b4d]">{additionalInfo.promotion || "Đang cập nhật"}</p>
          </article>
        </div>

        <article className="rounded-2xl border border-[#f2d5a7] bg-[#fff8eb] p-4 text-base text-[#6a4a22]">
          <p className="font-semibold">Lưu ý</p>
          <p className="mt-2">{additionalInfo.notes || "Lịch trình thực tế có thể thay đổi theo điều kiện thời tiết và vận hành."}</p>
        </article>
      </section>
    </div>
  );
}
