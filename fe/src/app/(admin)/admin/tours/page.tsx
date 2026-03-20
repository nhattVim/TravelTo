import { getTours } from "@/lib/api/public";
import { formatCurrencyVnd } from "@/lib/format";

export default async function AdminToursPage() {
  const tourData = await getTours().catch(() => ({ items: [], totalElements: 0, totalPages: 0, page: 0, size: 9 }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Tour Management</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#083b2d]">Quản lí tour</h2>
          <p className="mt-2 text-sm text-[#355a4d]">
            Theo dõi tồn chỗ, điểm đến và chất lượng dữ liệu tour. Màn hình này tách biệt hoàn toàn với khu vực đặt tour của user.
          </p>
        </div>
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-2xl border border-[#b5decd] bg-[#ecfff6] px-4 py-2 text-sm font-semibold text-[#517265] opacity-70"
        >
          Tạo tour mới (sắp có)
        </button>
      </header>

      <section className="rounded-2xl border border-[#cdece0] bg-white p-5">
        <p className="text-sm text-[#355a4d]">
          Tổng tour hiển thị: <span className="font-semibold text-[#083b2d]">{tourData.totalElements}</span>
        </p>

        {tourData.items.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[#98d8c0] bg-[#f8fffb] p-6 text-sm text-[#355a4d]">
            Chưa có dữ liệu tour.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {tourData.items.map((tour) => (
              <article key={tour.id} className="rounded-2xl border border-[#d5ede4] bg-[#fafffd] p-4">
                <p className="text-xs uppercase tracking-wide text-[#0a7d59]">#{tour.id} • {tour.provinceName}</p>
                <h3 className="mt-1 text-lg font-semibold text-[#083b2d]">{tour.title}</h3>
                <p className="mt-2 text-sm text-[#355a4d] line-clamp-2">{tour.summary}</p>
                <div className="mt-3 grid gap-2 text-sm text-[#355a4d]">
                  <p>Hành trình: {tour.departureLocation} → {tour.destinationLocation}</p>
                  <p>Giá: {formatCurrencyVnd(tour.price)}</p>
                  <p>Còn chỗ: {tour.slotsAvailable}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
