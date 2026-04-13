import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import { HorizontalTourCard } from "@/components/tours/horizontal-tour-card";
import { getTourFilterOptions, getTours } from "@/lib/api/public";
import { auth } from "@/auth";

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
  const budget =
    typeof resolvedSearchParams.budget === "string" ? resolvedSearchParams.budget : undefined;

  const session = await auth();
  const token = session?.backendAccessToken;

  let minPrice: number | undefined = undefined;
  let maxPrice: number | undefined = undefined;

  if (budget === "<5m") {
    maxPrice = 5000000;
  } else if (budget === "5m-10m") {
    minPrice = 5000000;
    maxPrice = 10000000;
  } else if (budget === "10m-20m") {
    minPrice = 10000000;
    maxPrice = 20000000;
  } else if (budget === ">20m") {
    minPrice = 20000000;
  }

  const [tourData, rawProvinces] = await Promise.all([
    getTours({
      provinceCode: province,
      departureLocation: departure,
      destinationLocation: destination,
      minPrice,
      maxPrice,
    }),
    fetch("https://provinces.open-api.vn/api/v2/p/").then((r) => r.json()),
  ]);

  const provinces = rawProvinces.map((p: { codename: string; name: string }) => ({
    code: p.codename,
    name: p.name,
  }));

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Danh Sách Tour"
        title="Chọn chuyến đi hợp gu của bạn"
        subtitle="Lọc theo điểm khởi hành và điểm đến để tìm nhanh chuyến đi phù hợp."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 relative h-fit rounded-3xl border border-[#cbeadf] bg-white p-5 shadow-[0_16px_28px_rgba(12,85,62,0.06)]">
          <h3 className="text-lg font-semibold text-[#0b3d2f]">Bộ lọc tìm kiếm</h3>
          <form method="get" className="mt-4 space-y-4">
            <label className="block space-y-2 text-base text-[#2f5b4d]">
              <span className="font-medium">Ngân sách</span>
              <select
                name="budget"
                defaultValue={budget ?? ""}
                className="w-full rounded-xl border border-[#98d9c1] bg-white px-3 py-2 text-base outline-none focus:border-[#0a7d59]"
              >
                <option value="">Tất cả mức giá</option>
                <option value="<5m">Dưới 5 triệu</option>
                <option value="5m-10m">Từ 5 - 10 triệu</option>
                <option value="10m-20m">Từ 10 - 20 triệu</option>
                <option value=">20m">Trên 20 triệu</option>
              </select>
            </label>
            <label className="block space-y-2 text-base text-[#2f5b4d]">
              <span className="font-medium">Điểm khởi hành</span>
              <select
                name="departure"
                defaultValue={departure ?? ""}
                className="w-full rounded-xl border border-[#98d9c1] bg-white px-3 py-2 text-base outline-none focus:border-[#0a7d59]"
              >
                <option value="">Tất cả</option>
                {provinces.map((p: { code: string; name: string }) => (
                  <option key={p.code} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2 text-base text-[#2f5b4d]">
              <span className="font-medium">Điểm đến</span>
              <select
                name="destination"
                defaultValue={destination ?? (province ? (provinces.find((p: { code: string; name: string }) => p.code === province)?.name ?? "") : "")}
                className="w-full rounded-xl border border-[#98d9c1] bg-white px-3 py-2 text-base outline-none focus:border-[#0a7d59]"
              >
                <option value="">Tất cả</option>
                {provinces.map((p: { code: string; name: string }) => (
                  <option key={p.code} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[#0a7d59] px-4 py-2 text-base font-semibold text-white transition hover:bg-[#085a41]"
              >
                Áp dụng
              </button>
              <Link
                href="/tours"
                className="rounded-xl border border-[#8fd5bd] px-4 py-2 text-base font-semibold text-[#0a7d59] transition hover:bg-[#ecfff7]"
              >
                Xóa lọc
              </Link>
            </div>
          </form>
        </aside>

        <section className="space-y-4 w-full min-w-0">
          {tourData.items.length > 0 ? (
            <div className="flex flex-col gap-5">
              {tourData.items.map((tour) => (
                <HorizontalTourCard key={tour.id} tour={tour} token={token} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#90d6be] bg-white p-8 text-base text-[#2d584b]">
              Chưa có tour phù hợp bộ lọc hiện tại.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
