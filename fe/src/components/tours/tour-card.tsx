import Image from "next/image";
import Link from "next/link";
import { formatCurrencyVnd } from "@/lib/format";
import { TourItem } from "@/types/travel";

interface TourCardProps {
  tour: TourItem;
}

export function TourCard({ tour }: TourCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#d3efe4] bg-white shadow-[0_14px_30px_rgba(14,95,68,0.08)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={tour.imageUrl}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#0a6f50]">
          {tour.provinceName}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <h3 className="line-clamp-1 text-xl font-semibold text-[#083b2d]">{tour.title}</h3>
        <p className="line-clamp-2 text-base text-[#37584f]">{tour.summary}</p>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#1c6650]">
          {tour.departureLocation} → {tour.destinationLocation}
        </p>
        <div className="flex items-center justify-between text-base text-[#1d493c]">
          <span>{tour.days} ngày · {tour.nights} đêm</span>
          <span>Còn {tour.slotsAvailable} chỗ</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-[#0a7d59]">{formatCurrencyVnd(tour.price)}</p>
          <Link
            href={`/tours/${tour.id}`}
            className="rounded-full bg-[#0a7d59] px-4 py-2 text-base font-semibold text-white transition hover:bg-[#085a41]"
          >
            Xem tour
          </Link>
        </div>
      </div>
    </article>
  );
}
