import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { deleteAdminTourAction } from "@/app/(admin)/admin/tours/actions";
import ConfirmSubmitButton from "@/components/shared/confirm-submit-button";
import { ApiHttpError } from "@/lib/api/client";
import { getAdminTours } from "@/lib/api/private";
import { formatCurrencyVnd } from "@/lib/format";

interface AdminTourListPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function pickSingle(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function feedbackText(params: Record<string, string | string[] | undefined>): string | null {
  const error = pickSingle(params.error);
  if (error) {
    try {
      return decodeURIComponent(error);
    } catch {
      return "Đã có lỗi xảy ra.";
    }
  }

  if (pickSingle(params.deleted) === "1") {
    return "Đã xóa tour thành công.";
  }

  return null;
}

function statusClass(status: string): string {
  if (status === "PUBLISHED") {
    return "border-[#95d8bf] bg-[#e8fff4] text-[#086447]";
  }
  return "border-[#f0cd94] bg-[#fff7e7] text-[#7d4d1a]";
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function parsePositiveInt(value: string | undefined, fallbackValue: number): number {
  if (!value) {
    return fallbackValue;
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 1) {
    return fallbackValue;
  }

  return Math.floor(numeric);
}

function buildListLink(page: number, size: number, keyword: string): string {
  const query = new URLSearchParams();
  if (keyword) {
    query.set("q", keyword);
  }
  query.set("page", String(page));
  query.set("size", String(size));
  return `/admin/tours?${query.toString()}`;
}

export default async function AdminTourListPage({ searchParams }: AdminTourListPageProps) {
  const session = await auth();
  if (!session?.backendAccessToken || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const params = searchParams ? await searchParams : {};
  const feedback = feedbackText(params);
  const keyword = normalizeText(pickSingle(params.q) ?? "");
  const currentPage = parsePositiveInt(pickSingle(params.page), 1);
  const pageSize = Math.min(parsePositiveInt(pickSingle(params.size), 8), 20);

  const tours = await getAdminTours(session.backendAccessToken, { page: 0, size: 500 }).catch((error) => {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect("/login?reason=session-expired");
    }
    throw error;
  });

  const filteredTours = tours.items.filter((tour) => {
    if (!keyword) {
      return true;
    }

    const searchable = [
      String(tour.id),
      tour.title,
      tour.provinceName,
      tour.departureLocation,
      tour.destinationLocation,
      tour.status,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(keyword);
  });

  const totalPages = Math.max(1, Math.ceil(filteredTours.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;
  const pagedTours = filteredTours.slice(start, start + pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Tour Management</p>
          <h2 className="mt-2 text-4xl font-semibold text-[#083b2d]">Danh sách tour</h2>
          <p className="mt-2 text-base text-[#355a4d]">Chọn tour để xem chi tiết và chỉnh sửa, hoặc thêm tour mới.</p>
        </div>

        <Link
          href="/admin/tours/new"
          className="rounded-xl bg-[#0a7d59] px-4 py-2 text-base font-semibold text-white transition hover:bg-[#085a41]"
        >
          + Thêm tour mới
        </Link>
      </header>

      {feedback ? (
        <section className="rounded-2xl border border-[#bfe4d2] bg-[#effff7] px-4 py-3 text-base text-[#1f5847]">{feedback}</section>
      ) : null}

      <section className="rounded-2xl border border-[#cdece0] bg-white p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[#083b2d]">Tổng tour: {filteredTours.length}</h3>
            <p className="text-base text-[#355a4d]">Trang {safePage}/{totalPages}</p>
          </div>

          <form action="/admin/tours" className="flex flex-wrap items-end gap-2">
            <label className="text-sm text-[#355a4d]">
              Tìm kiếm
              <input
                type="text"
                name="q"
                defaultValue={pickSingle(params.q) ?? ""}
                placeholder="Tên tour, tỉnh, điểm đi/đến..."
                className="mt-1 block w-64 rounded-xl border border-[#a7d9c5] px-3 py-2 text-base text-[#123d31]"
              />
            </label>
            <input type="hidden" name="size" value={pageSize} />
            <button
              type="submit"
              className="rounded-xl border border-[#9ad9bf] bg-white px-3 py-2 text-sm font-semibold text-[#0a7d59] transition hover:bg-[#f1fff8]"
            >
              Lọc
            </button>
            <Link
              href="/admin/tours"
              className="rounded-xl border border-[#d2e8df] bg-[#fbfffd] px-3 py-2 text-sm font-semibold text-[#315748] transition hover:bg-[#f2fbf7]"
            >
              Bỏ lọc
            </Link>
          </form>
        </div>

        {pagedTours.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#98d8c0] bg-[#f8fffb] p-6 text-base text-[#355a4d]">
            Chưa có tour nào.
          </div>
        ) : (
          <div className="space-y-3">
            {pagedTours.map((tour) => (
              <article key={tour.id} className="rounded-2xl border border-[#d8efe6] bg-[#fbfffd] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-[#0a7d59]">#{tour.id} • {tour.provinceName}</p>
                    <h4 className="mt-1 text-xl font-semibold text-[#083b2d]">{tour.title}</h4>
                    <p className="mt-1 text-base text-[#355a4d]">{tour.departureLocation} → {tour.destinationLocation}</p>
                    <p className="mt-1 text-base text-[#355a4d]">
                      {formatCurrencyVnd(tour.price)} • {tour.days}N{tour.nights}Đ • {tour.slotsAvailable}/{tour.slotsTotal} chỗ
                    </p>
                  </div>

                  <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusClass(tour.status)}`}>
                    {tour.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/admin/tours/${tour.id}?q=${encodeURIComponent(keyword)}&page=${safePage}&size=${pageSize}`}
                    className="rounded-xl border border-[#9ad9bf] bg-white px-3 py-2 text-sm font-semibold text-[#0a7d59] transition hover:bg-[#f1fff8]"
                  >
                    Xem chi tiết
                  </Link>

                  <form action={deleteAdminTourAction}>
                    <input type="hidden" name="tourId" value={tour.id} />
                    <ConfirmSubmitButton
                      message="Bạn có chắc muốn xóa tour này không?"
                      className="rounded-xl border border-[#f2c0b4] bg-[#fff7f5] px-3 py-2 text-sm font-semibold text-[#a93e23] transition hover:bg-[#ffece6]"
                    >
                      Xóa tour
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <nav className="mt-5 flex flex-wrap items-center gap-2">
            {pageNumbers.map((page) => (
              <Link
                key={page}
                href={buildListLink(page, pageSize, keyword)}
                className={`rounded-lg px-3 py-1 text-base font-semibold transition ${page === safePage
                    ? "bg-[#0a7d59] text-white"
                    : "border border-[#9ad9bf] bg-white text-[#0a7d59] hover:bg-[#f1fff8]"
                  }`}
              >
                {page}
              </Link>
            ))}
          </nav>
        ) : null}
      </section>
    </div>
  );
}
