"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

interface TourImageSliderProps {
  images: string[];
  title: string;
}

export function TourImageSlider({ images, title }: TourImageSliderProps) {
  const normalizedImages = useMemo(
    () => images.filter((item) => typeof item === "string" && item.trim().length > 0),
    [images],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  if (normalizedImages.length === 0) {
    return null;
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % normalizedImages.length);
  };

  return (
    <div className="space-y-3">
      <div className="relative h-72 overflow-hidden rounded-3xl border border-[#cdece0] bg-white md:h-104">
        <Image
          src={normalizedImages[activeIndex]}
          alt={`${title} - ảnh ${activeIndex + 1}`}
          fill
          priority
          className="object-cover"
        />

        {normalizedImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-base font-semibold text-[#0a7d59] shadow transition hover:bg-white"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-base font-semibold text-[#0a7d59] shadow transition hover:bg-white"
            >
              →
            </button>
          </>
        ) : null}
      </div>

      {normalizedImages.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {normalizedImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-14 w-20 overflow-hidden rounded-xl border transition ${index === activeIndex ? "border-[#0a7d59]" : "border-[#cfece2]"
                }`}
            >
              <div className="relative h-full w-full">
                <Image src={image} alt={`${title} thumbnail ${index + 1}`} fill className="object-cover" />
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
