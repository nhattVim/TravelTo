import Image from "next/image";
import Link from "next/link";
import { formatCurrencyVnd } from "@/lib/format";
import { TourItem } from "@/types/travel";
import { IconFavoriteButton } from "./icon-favorite-button";

interface HorizontalTourCardProps {
  tour: TourItem;
  token?: string;
}

export function HorizontalTourCard({ tour, token }: HorizontalTourCardProps) {
  // Generate some mock departure dates to match the visual vibe,
  // since TourItem doesn't include the full departure array
  const mockDates = ["25/04", "09/05", "23/05", "13/06"];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white sm:flex-row">
      {/* Left Side (Image & Badges) */}
      <div className="relative h-64 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[320px] md:w-90">
        <Image
          src={tour.imageUrl}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Heart icon top left */}
        <IconFavoriteButton tourId={tour.id} token={token} />
      </div>

      {/* Right Side (Content) */}
      <div className="flex grow flex-col p-5">
        {/* Title */}
        <h3 className="line-clamp-2 text-xl font-bold text-gray-900 transition-colors hover:text-[#0a7d59]">
          <Link href={`/tours/${tour.id}`}>
            {tour.title}
          </Link>
        </h3>

        {/* Info Grid */}
        <div className="mt-4 flex flex-col gap-y-3 sm:grid sm:grid-cols-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Mã tour:</span>
            <span className="font-semibold text-gray-900 line-clamp-1">{tour.provinceCode}{tour.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Khởi hành:</span>
            <span className="font-semibold text-[#0a7d59]">{tour.departureLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Thời gian:</span>
            <span className="font-semibold text-gray-900">{tour.days}N{tour.nights}Đ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Phương tiện:</span>
            <span className="font-semibold text-gray-900">Máy bay</span>
          </div>
        </div>

        {/* Departure Dates */}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <span className="hidden sm:inline">Ngày khởi hành:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {mockDates.map((date, idx) => (
              <span key={idx} className="rounded-md border border-[#e3241b] bg-white px-2 py-1 text-xs font-semibold text-[#e3241b]">
                {date}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 sm:mt-auto pt-4 flex flex-col justify-between sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-gray-500">Giá từ:</p>
            <p className="text-2xl font-bold text-[#e3241b] flex items-end gap-1">
              {formatCurrencyVnd(tour.price)}
              <span className="text-[#e3241b] underline font-bold text-lg">đ</span>
            </p>
          </div>

          <Link
            href={`/tours/${tour.id}`}
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#2b71c8] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f5aaa] sm:mt-0"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}
