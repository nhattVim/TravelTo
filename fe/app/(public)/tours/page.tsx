import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import { TourCard } from "@/components/tours/tour-card";
import { getProvinceOverview, getTours } from "@/lib/api/public";

interface ToursPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const province =
    typeof resolvedSearchParams.province === "string" ? resolvedSearchParams.province : undefined;

  const [tourData, provinces] = await Promise.all([getTours(province), getProvinceOverview()]);

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Danh Sách Tour"
        title="Chọn chuyến đi hợp gu của bạn"
        subtitle="Lọc theo tỉnh thành để tìm nhanh tour phù hợp ngân sách và thời gian của bạn."
      />

      <div className="flex flex-wrap gap-2">
        <Link
          href="/tours"
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            !province
              ? "border-[#0a7d59] bg-[#0a7d59] text-white"
              : "border-[#8cd3bc] bg-white text-[#0a7d59] hover:bg-[#e9fff5]"
          }`}
        >
          Tất cả
        </Link>
        {provinces.map((item) => (
          <Link
            key={item.id}
            href={`/tours?province=${item.code}`}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              province === item.code
                ? "border-[#0a7d59] bg-[#0a7d59] text-white"
                : "border-[#8cd3bc] bg-white text-[#0a7d59] hover:bg-[#e9fff5]"
            }`}
          >
            {item.name} ({item.tourCount})
          </Link>
        ))}
      </div>

      {tourData.items.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tourData.items.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#90d6be] bg-white p-8 text-sm text-[#2d584b]">
          Chưa có tour phù hợp bộ lọc hiện tại.
        </div>
      )}
    </div>
  );
}
