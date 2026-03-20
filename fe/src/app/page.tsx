import Link from "next/link";
import { HeroBanner } from "@/components/home/hero-banner";
import { ProvinceGrid } from "@/components/home/province-grid";
import { SectionTitle } from "@/components/shared/section-title";
import { SiteShell } from "@/components/layout/site-shell";
import { TourCard } from "@/components/tours/tour-card";
import { getHighlights, getProvinceOverview } from "@/lib/api/public";

export default async function HomePage() {
  const [provinces, highlights] = await Promise.all([getProvinceOverview(), getHighlights()]);

  return (
    <SiteShell>
      <div className="space-y-14 md:space-y-20">
        <HeroBanner />

        <section className="space-y-6">
          <SectionTitle
            eyebrow="Theo Tỉnh Thành"
            title="Bạn muốn đi đâu ở Việt Nam?"
            subtitle="Mỗi tỉnh thành là một vibe du lịch khác nhau. Chọn địa điểm và xem ngay các tour đang mở bán."
          />
          <ProvinceGrid provinces={provinces} />
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionTitle
              eyebrow="Hot Tours"
              title="Tour nổi bật tuần này"
              subtitle="Danh sách tour được cộng đồng TravelTo quan tâm nhiều nhất trong tuần."
            />
            <Link href="/tours" className="rounded-full bg-[#0a7d59] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#085a41]">
              Xem tất cả tour
            </Link>
          </div>

          {highlights.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {highlights.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#95d8bf] bg-white p-8 text-center text-sm text-[#2e5a4d]">
              Dữ liệu tour đang được cập nhật, bạn quay lại sau ít phút nhé.
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-[#cdece0] bg-white px-6 py-8 md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Bắt đầu nhanh</p>
              <h3 className="mt-2 text-2xl font-semibold text-[#083b2d]">Đăng nhập Google và đặt tour chỉ trong vài bước</h3>
            </div>
            <Link href="/login" className="inline-flex w-fit rounded-full border border-[#0a7d59] px-6 py-3 text-sm font-semibold text-[#0a7d59] transition hover:bg-[#e6fff4]">
              Đăng nhập ngay
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
