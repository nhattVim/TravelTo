import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrencyVnd } from "@/lib/format";
import { getTourDetail } from "@/lib/api/public";

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

  return (
    <div className="space-y-8">
      <Link href="/tours" className="text-sm font-semibold text-[#0a7d59] hover:underline">
        ← Quay lại danh sách tour
      </Link>

      <section className="overflow-hidden rounded-3xl border border-[#cdece0] bg-white">
        <div className="relative h-72 w-full">
          <Image src={tour.imageUrl} alt={tour.title} fill className="object-cover" />
        </div>
        <div className="space-y-4 p-6 md:p-8">
          <p className="inline-flex rounded-full bg-[#e4fff4] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0a7d59]">
            {tour.provinceName}
          </p>
          <h1 className="text-3xl font-bold text-[#083b2d] md:text-4xl">{tour.title}</h1>
          <p className="text-base text-[#34594d]">{tour.summary}</p>
          <div className="grid gap-4 rounded-2xl bg-[#f0fff7] p-5 text-sm text-[#1f4f41] md:grid-cols-3">
            <p>Thời lượng: {tour.days} ngày · {tour.nights} đêm</p>
            <p>Chỗ trống: {tour.slotsAvailable}</p>
            <p>Giá từ: {formatCurrencyVnd(tour.price)}</p>
          </div>
          <p className="leading-relaxed text-[#264f42]">{tour.description}</p>
          <Link
            href={`/bookings?tourId=${tour.id}`}
            className="inline-flex rounded-full bg-[#0a7d59] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#085a41]"
          >
            Đặt tour này
          </Link>
        </div>
      </section>
    </div>
  );
}
