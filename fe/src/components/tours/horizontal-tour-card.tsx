"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useMemo } from "react";
import { formatCurrencyVnd } from "@/lib/format";
import { TourItem } from "@/types/travel";
import { IconFavoriteButton } from "./icon-favorite-button";

interface HorizontalTourCardProps {
  tour: TourItem;
  token?: string;
}

export function HorizontalTourCard({ tour, token }: HorizontalTourCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Format YYYY-MM-DD to DD/MM
  const formatDate = (dateString: string) => {
    const parts = dateString.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return dateString;
  };

  const datesToDisplay = useMemo(() => {
    return tour.nextDepartures && tour.nextDepartures.length > 0
      ? tour.nextDepartures
      : [];
  }, [tour.nextDepartures]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [datesToDisplay]);

  const scrollDates = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white sm:flex-row h-full sm:h-auto w-full min-w-0">
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
      <div className="flex grow flex-col p-5 min-w-0">
        {/* Title */}
        <h3 className="line-clamp-2 text-xl font-bold text-gray-900 transition-colors hover:text-[#0a7d59]">
          <Link href={`/tours/${tour.id}`}>
            {tour.title}
          </Link>
        </h3>

        {/* Info Grid */}
        <div className="mt-4 flex flex-col gap-y-3 sm:grid sm:grid-cols-2 text-sm text-gray-700">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-gray-500 shrink-0">Mã tour:</span>
            <span className="font-semibold text-gray-900 truncate">{tour.provinceCode}{tour.id}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-gray-500 shrink-0">Khởi hành:</span>
            <span className="font-semibold text-[#0a7d59] truncate">{tour.departureLocation}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-gray-500 shrink-0">Thời gian:</span>
            <span className="font-semibold text-gray-900 truncate">{tour.days}N{tour.nights}Đ</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-gray-500 shrink-0">Phương tiện:</span>
            <span className="font-semibold text-gray-900 truncate">Máy bay</span>
          </div>
        </div>

        {/* Departure Dates with Nativr/Custom Scroll */}
        <div className="mt-4 flex items-center gap-4 text-sm w-full min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 text-gray-700 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <span className="hidden sm:inline shrink-0">Khởi hành:</span>
          </div>

          {datesToDisplay.length > 0 ? (
            <div className="relative flex-1 min-w-0 flex items-center group/dates">
              {/* Left Gradient & Arrow */}
              {showLeftArrow && (
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-white to-transparent z-10 flex items-center justify-start">
                  <button
                    onClick={(e) => { e.preventDefault(); scrollDates("left"); }}
                    className="h-5 w-5 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:text-[#0a7d59] transition hover:scale-110"
                    aria-label="Scroll left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                  </button>
                </div>
              )}

              <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide w-full scroll-smooth px-1"
                style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
              >
                {datesToDisplay.map((date, idx) => (
                  <Link
                    href={`/tours/${tour.id}?date=${date}#lich-khoi-hanh`}
                    key={idx}
                    className="shrink-0 rounded-md border border-[#e3241b] bg-white px-2.5 py-2 text-[11px] font-bold text-[#e3241b] transition hover:bg-[#e3241b] hover:text-white"
                  >
                    {formatDate(date)}
                  </Link>
                ))}
              </div>

              {/* Right Gradient & Arrow */}
              {showRightArrow && (
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent z-10 flex items-center justify-end">
                  <button
                    onClick={(e) => { e.preventDefault(); scrollDates("right"); }}
                    className="h-5 w-5 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:text-[#0a7d59] transition hover:scale-110"
                    aria-label="Scroll right"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <span className="text-xs text-gray-400 italic">Đang cập nhật lịch</span>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-4 sm:mt-auto pt-4 border-t border-dashed border-gray-200 flex flex-col justify-between sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-gray-500">Giá từ:</p>
            <p className="text-2xl font-bold text-[#e3241b] flex items-end gap-1">
              {formatCurrencyVnd(tour.price)}
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
