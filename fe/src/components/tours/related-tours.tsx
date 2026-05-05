"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TourItem } from "@/types/travel";
import { TourCard } from "@/components/tours/tour-card";

interface RelatedToursProps {
  tours: TourItem[];
}

export function RelatedTours({ tours }: RelatedToursProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!tours || tours.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="space-y-6 rounded-3xl border border-[#cdece0] bg-white p-6 md:p-8">
      <div className="flex items-end justify-between mb-2">
        <div>
          <h2 className="text-3xl font-bold text-[#083b2d]">Có thể bạn cũng thích</h2>
          <p className="text-gray-500 mt-2 text-base">Các tour có mức giá tương đương</p>
        </div>
        
        {tours.length > 3 && (
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cdece0] bg-white text-[#0a7d59] shadow-sm transition hover:bg-[#e4fff4] hover:text-[#085a41]"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cdece0] bg-white text-[#0a7d59] shadow-sm transition hover:bg-[#e4fff4] hover:text-[#085a41]"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {tours.map((tour) => (
            <div key={tour.id} className="min-w-[280px] sm:min-w-[320px] lg:min-w-[340px] flex-1 flex-shrink-0 snap-start">
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
        
        {/* Hide webkit scrollbar using inline styles hack */}
        <style dangerouslySetInnerHTML={{__html: `
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `}} />
      </div>
    </section>
  );
}
