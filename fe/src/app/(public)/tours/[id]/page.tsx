import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrencyVnd } from "@/lib/format";
import { getTourDetail } from "@/lib/api/public";
import { TourDepartureCalendar } from "@/components/tours/tour-departure-calendar";
import { TourImageSlider } from "@/components/tours/tour-image-slider";
import { auth } from "@/auth";
import { checkWishlistStatus } from "@/lib/api/private";
import { FavoriteButton } from "@/components/tours/favorite-button";

interface TourDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    notFound();
  }

  const tour = await getTourDetail(numericId).catch(() => null);
  if (!tour) {
    notFound();
  }

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
      <Link href="/tours" className="text-sm font-semibold text-[#0a7d59] hover:underline">
        ← Quay lại danh sách tour
      </Link>

      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4 rounded-3xl border border-[#cdece0] bg-white p-5 md:p-6">
          <TourImageSlider images={galleryImages} title={tour.title} />

          <div className="space-y-4">
            <p className="inline-flex rounded-full bg-[#e4fff4] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0a7d59]">
              {tour.provinceName}
            </p>
            <h1 className="text-3xl font-bold text-[#083b2d] md:text-4xl">{tour.title}</h1>
            <p className="text-base text-[#34594d]">{tour.summary}</p>
            <div className="grid gap-4 rounded-2xl bg-[#f0fff7] p-5 text-sm text-[#1f4f41] md:grid-cols-3">
              <p>Thời lượng: {tour.days} ngày · {tour.nights} đêm</p>
              <p>Lộ trình: {tour.departureLocation} → {tour.destinationLocation}</p>
              <p>Giá từ: {formatCurrencyVnd(tour.price)}</p>
            </div>
            <p className="leading-relaxed text-[#264f42]">{tour.description}</p>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-[#cdece0] bg-white p-5 shadow-[0_18px_30px_rgba(7,68,50,0.06)]">
          <p className="text-sm font-semibold text-[#0d3f30]">Giá từ</p>
          <p className="mt-1 text-4xl font-bold text-[#db2200]">{formatCurrencyVnd(tour.price)}</p>
          <p className="mt-4 text-sm text-[#285447]">Khởi hành: {tour.departureLocation}</p>
          <p className="mt-1 text-sm text-[#285447]">Điểm đến: {tour.destinationLocation}</p>
          <p className="mt-1 text-sm text-[#285447]">Số chỗ toàn tour: {tour.slotsAvailable}</p>

          <a
            href="#lich-khoi-hanh"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#0a7d59] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#085a41]"
          >
            Chọn ngày khởi hành
          </a>
          
          <FavoriteButton
            tourId={tour.id}
            initialIsWished={isWished}
            token={token}
          />
        </aside>
      </section>

      <div id="lich-khoi-hanh">
        <TourDepartureCalendar tourId={tour.id} departures={tour.departures ?? []} />
      </div>

      <section className="space-y-6 rounded-3xl border border-[#cdece0] bg-white p-6 md:p-8">
        <h2 className="text-3xl font-bold text-[#083b2d]">Thông tin thêm về chuyến đi</h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl border border-[#d9efe6] bg-[#f8fffb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Điểm tham quan</p>
            <p className="mt-2 text-sm text-[#2f5b4d]">{additionalInfo.attractions || "Đang cập nhật"}</p>
          </article>
          <article className="rounded-2xl border border-[#d9efe6] bg-[#f8fffb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Ẩm thực</p>
            <p className="mt-2 text-sm text-[#2f5b4d]">{additionalInfo.cuisine || "Đang cập nhật"}</p>
          </article>
          <article className="rounded-2xl border border-[#d9efe6] bg-[#f8fffb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Đối tượng phù hợp</p>
            <p className="mt-2 text-sm text-[#2f5b4d]">{additionalInfo.suitableFor || "Đang cập nhật"}</p>
          </article>
          <article className="rounded-2xl border border-[#d9efe6] bg-[#f8fffb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Thời gian lý tưởng</p>
            <p className="mt-2 text-sm text-[#2f5b4d]">{additionalInfo.idealTime || "Đang cập nhật"}</p>
          </article>
          <article className="rounded-2xl border border-[#d9efe6] bg-[#f8fffb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Phương tiện</p>
            <p className="mt-2 text-sm text-[#2f5b4d]">{additionalInfo.transport || "Đang cập nhật"}</p>
          </article>
          <article className="rounded-2xl border border-[#d9efe6] bg-[#f8fffb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a7d59]">Khuyến mãi</p>
            <p className="mt-2 text-sm text-[#2f5b4d]">{additionalInfo.promotion || "Đang cập nhật"}</p>
          </article>
        </div>

        <article className="rounded-2xl border border-[#f2d5a7] bg-[#fff8eb] p-4 text-sm text-[#6a4a22]">
          <p className="font-semibold">Lưu ý</p>
          <p className="mt-2">{additionalInfo.notes || "Lịch trình thực tế có thể thay đổi theo điều kiện thời tiết và vận hành."}</p>
        </article>
      </section>
    </div>
  );
}
