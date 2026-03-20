import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import { TourCard } from "@/components/tours/tour-card";
import { getTourFilterOptions, getTours } from "@/lib/api/public";

interface ToursPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const province =
    typeof resolvedSearchParams.province === "string" ? resolvedSearchParams.province : undefined;
  const departure =
    typeof resolvedSearchParams.departure === "string" ? resolvedSearchParams.departure : undefined;
  const destination =
    typeof resolvedSearchParams.destination === "string" ? resolvedSearchParams.destination : undefined;

  const [tourData, filterOptions] = await Promise.all([
    getTours({
      provinceCode: province,
      departureLocation: departure,
      destinationLocation: destination,
    }),
    getTourFilterOptions(),
  ]);

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Danh Sách Tour"
        title="Chọn chuyến đi hợp gu của bạn"
        subtitle="Lọc theo điểm khởi hành và điểm đến để tìm nhanh chuyến đi phù hợp."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-3xl border border-[#cbeadf] bg-white p-5 shadow-[0_16px_28px_rgba(12,85,62,0.06)]">
          <h3 className="text-base font-semibold text-[#0b3d2f]">Bộ lọc tìm kiếm</h3>
          <form method="get" className="mt-4 space-y-4">
            <label className="block space-y-2 text-sm text-[#2f5b4d]">
              <span className="font-medium">Điểm khởi hành</span>
              <select
                name="departure"
                defaultValue={departure ?? ""}
                className="w-full rounded-xl border border-[#98d9c1] bg-white px-3 py-2 text-sm outline-none focus:border-[#0a7d59]"
              >
                <option value="">Tất cả</option>
                {filterOptions.departureLocations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2 text-sm text-[#2f5b4d]">
              <span className="font-medium">Điểm đến</span>
              <select
                name="destination"
                defaultValue={destination ?? ""}
                className="w-full rounded-xl border border-[#98d9c1] bg-white px-3 py-2 text-sm outline-none focus:border-[#0a7d59]"
              >
                <option value="">Tất cả</option>
                {filterOptions.destinationLocations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[#0a7d59] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#085a41]"
              >
                Áp dụng
              </button>
              <Link
                href="/tours"
                className="rounded-xl border border-[#8fd5bd] px-4 py-2 text-sm font-semibold text-[#0a7d59] transition hover:bg-[#ecfff7]"
              >
                Xóa lọc
              </Link>
            </div>
          </form>
        </aside>

        <section className="space-y-4">
          {tourData.items.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
              {tourData.items.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#90d6be] bg-white p-8 text-sm text-[#2d584b]">
              Chưa có tour phù hợp bộ lọc hiện tại.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
