import Link from "next/link";
import { ProvinceOverview } from "@/types/travel";

interface ProvinceGridProps {
  provinces: ProvinceOverview[];
}

export function ProvinceGrid({ provinces }: ProvinceGridProps) {
  if (provinces.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#8dd3bc] bg-white p-6 text-sm text-[#2f5d51]">
        Tạm thời chưa tải được dữ liệu tỉnh thành. Bạn có thể thử lại sau ít phút.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {provinces.map((province, index) => (
        <Link
          href={`/tours?province=${province.code}`}
          key={province.id}
          className="group relative overflow-hidden rounded-3xl border border-[#d4efe6] bg-white p-5 shadow-[0_12px_28px_rgba(9,88,61,0.08)]"
          style={{ animationDelay: `${index * 120}ms` }}
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#b5f5d6] opacity-60 transition group-hover:scale-125" />
          <p className="relative z-10 text-lg font-semibold text-[#093f2f]">{province.name}</p>
          <p className="relative z-10 mt-2 text-sm text-[#2d5a4d]">{province.tourCount} tour đang mở</p>
          <p className="relative z-10 mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#0a7d59]">Xem tour</p>
        </Link>
      ))}
    </div>
  );
}
