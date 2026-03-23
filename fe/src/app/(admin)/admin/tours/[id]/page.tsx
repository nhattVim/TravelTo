import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  createAdminDepartureAction,
  deleteAdminDepartureAction,
  deleteAdminTourAction,
  updateAdminDepartureAction,
  updateAdminTourAction,
} from "@/app/(admin)/admin/tours/actions";
import ConfirmSubmitButton from "@/components/shared/confirm-submit-button";
import { ApiHttpError } from "@/lib/api/client";
import { getAdminTourDetail } from "@/lib/api/private";
import { formatCurrencyVnd, formatDateVi } from "@/lib/format";
import { TourDeparture } from "@/types/travel";

interface AdminTourDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function pickSingle(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function toDateInputValue(value: string): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString().slice(0, 10);
}

function messageFromParams(params: Record<string, string | string[] | undefined>): string | null {
  const error = pickSingle(params.error);
  if (error) {
    if (error === "invalid-form") {
      return "Vui lòng kiểm tra lại thông tin tour.";
    }
    if (error === "invalid-departure-form") {
      return "Vui lòng kiểm tra lại thông tin đợt khởi hành.";
    }
    try {
      return decodeURIComponent(error);
    } catch {
      return "Đã có lỗi xảy ra.";
    }
  }

  if (pickSingle(params.saved) === "1") return "Đã tạo tour thành công.";
  if (pickSingle(params.updated) === "1") return "Đã cập nhật tour thành công.";
  if (pickSingle(params.departureSaved) === "1") return "Đã thêm đợt khởi hành.";
  if (pickSingle(params.departureUpdated) === "1") return "Đã cập nhật đợt khởi hành.";
  if (pickSingle(params.departureDeleted) === "1") return "Đã xóa đợt khởi hành.";

  return null;
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

function sortedDepartures(list: TourDeparture[]): TourDeparture[] {
  return [...list].sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
}

function findNearestUpcomingDepartureId(list: TourDeparture[]): number | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = list.find((item) => {
    const departure = new Date(item.departureDate);
    departure.setHours(0, 0, 0, 0);
    return departure.getTime() >= today.getTime();
  });

  return upcoming?.id ?? null;
}

export default async function AdminTourDetailPage({ params, searchParams }: AdminTourDetailPageProps) {
  const session = await auth();
  if (!session?.backendAccessToken || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const idValue = Number((await params).id);
  if (!Number.isFinite(idValue) || idValue <= 0) {
    notFound();
  }

  const tour = await getAdminTourDetail(session.backendAccessToken, idValue).catch((error) => {
    if (error instanceof ApiHttpError) {
      if (error.status === 404) {
        notFound();
      }
      if (error.status === 401 || error.status === 403) {
        redirect("/login?reason=session-expired");
      }
    }
    throw error;
  });

  const query = searchParams ? await searchParams : {};
  const message = messageFromParams(query);
  const keyword = pickSingle(query.q) ?? "";
  const page = parsePositiveInt(pickSingle(query.page), 1);
  const size = parsePositiveInt(pickSingle(query.size), 8);

  const backParams = new URLSearchParams();
  if (keyword.trim()) {
    backParams.set("q", keyword);
  }
  backParams.set("page", String(page));
  backParams.set("size", String(size));
  const backHref = `/admin/tours?${backParams.toString()}`;

  const departures = sortedDepartures(tour.departures);
  const nearestUpcomingDepartureId = findNearestUpcomingDepartureId(departures);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Tour Management</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#083b2d]">Chi tiết tour #{tour.id}</h2>
          <p className="mt-2 text-sm text-[#355a4d]">{tour.title}</p>
        </div>

        <Link
          href={backHref}
          className="rounded-xl border border-[#9ad9bf] bg-white px-4 py-2 text-sm font-semibold text-[#0a7d59] transition hover:bg-[#f1fff8]"
        >
          ← Quay lại danh sách
        </Link>
      </header>

      {message ? (
        <section className="rounded-2xl border border-[#bfe4d2] bg-[#effff7] px-4 py-3 text-sm text-[#1f5847]">{message}</section>
      ) : null}

      <section className="rounded-2xl border border-[#cdece0] bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#083b2d]">Thông tin tour</h3>
          <form action={deleteAdminTourAction}>
            <input type="hidden" name="tourId" value={tour.id} />
            <ConfirmSubmitButton
              message="Bạn có chắc muốn xóa tour này không?"
              className="rounded-xl border border-[#f2c0b4] bg-[#fff7f5] px-3 py-2 text-xs font-semibold text-[#a93e23] transition hover:bg-[#ffece6]"
            >
              Xóa tour
            </ConfirmSubmitButton>
          </form>
        </div>

        <form action={updateAdminTourAction} className="space-y-4">
          <input type="hidden" name="tourId" value={tour.id} />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-[#355a4d]">
              Province code
              <input
                name="provinceCode"
                defaultValue={tour.provinceCode}
                required
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d]">
              Trạng thái
              <select
                name="status"
                defaultValue={tour.status}
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
              </select>
            </label>

            <label className="space-y-1 text-sm text-[#355a4d] md:col-span-2">
              Tiêu đề
              <input
                name="title"
                defaultValue={tour.title}
                required
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d] md:col-span-2">
              Tóm tắt
              <textarea
                name="summary"
                defaultValue={tour.summary}
                required
                rows={2}
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d] md:col-span-2">
              Mô tả chi tiết
              <textarea
                name="description"
                defaultValue={tour.description}
                required
                rows={5}
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d]">
              Giá cơ bản (VND)
              <input
                name="price"
                type="number"
                min={1}
                defaultValue={tour.price}
                required
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-sm text-[#355a4d]">
                Số ngày
                <input
                  name="days"
                  type="number"
                  min={1}
                  defaultValue={tour.days}
                  required
                  className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
                />
              </label>
              <label className="space-y-1 text-sm text-[#355a4d]">
                Số đêm
                <input
                  name="nights"
                  type="number"
                  min={0}
                  defaultValue={tour.nights}
                  required
                  className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
                />
              </label>
            </div>

            <label className="space-y-1 text-sm text-[#355a4d]">
              Điểm khởi hành
              <input
                name="departureLocation"
                defaultValue={tour.departureLocation}
                required
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d]">
              Điểm đến
              <input
                name="destinationLocation"
                defaultValue={tour.destinationLocation}
                required
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d] md:col-span-2">
              Ảnh đại diện (URL)
              <input
                name="imageUrl"
                defaultValue={tour.imageUrl ?? ""}
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d] md:col-span-2">
              Danh sách ảnh (mỗi dòng 1 URL)
              <textarea
                name="imageUrls"
                defaultValue={tour.imageUrls.join("\n")}
                rows={3}
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d]">
              Điểm nổi bật
              <textarea
                name="attractions"
                defaultValue={tour.additionalInfo.attractions ?? ""}
                rows={2}
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d]">
              Ẩm thực
              <textarea
                name="cuisine"
                defaultValue={tour.additionalInfo.cuisine ?? ""}
                rows={2}
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d]">
              Phù hợp với
              <textarea
                name="suitableFor"
                defaultValue={tour.additionalInfo.suitableFor ?? ""}
                rows={2}
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d]">
              Thời điểm lý tưởng
              <textarea
                name="idealTime"
                defaultValue={tour.additionalInfo.idealTime ?? ""}
                rows={2}
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d]">
              Di chuyển
              <textarea
                name="transport"
                defaultValue={tour.additionalInfo.transport ?? ""}
                rows={2}
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d]">
              Khuyến mãi
              <textarea
                name="promotion"
                defaultValue={tour.additionalInfo.promotion ?? ""}
                rows={2}
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>

            <label className="space-y-1 text-sm text-[#355a4d] md:col-span-2">
              Ghi chú
              <textarea
                name="notes"
                defaultValue={tour.additionalInfo.notes ?? ""}
                rows={3}
                className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
              />
            </label>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="rounded-xl bg-[#0a7d59] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#085a41]">
              Lưu thông tin tour
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-[#cdece0] bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#083b2d]">Đợt khởi hành ({tour.departures.length})</h3>
          <p className="text-sm text-[#355a4d]">Giá hiện tại: {formatCurrencyVnd(tour.price)}</p>
        </div>

        {departures.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#98d8c0] bg-[#f8fffb] p-4 text-sm text-[#355a4d]">
            Chưa có đợt khởi hành nào.
          </div>
        ) : (
          <div className="space-y-3">
            {departures.map((departure) => {
              const isNearestUpcoming = departure.id === nearestUpcomingDepartureId;

              return (
                <article
                  key={departure.id}
                  className={`rounded-2xl p-4 ${isNearestUpcoming
                      ? "border-2 border-[#6fbf9f] bg-[#f2fff9]"
                      : "border border-[#d8efe6] bg-[#fbfffd]"
                    }`}
                >
                  <div className="mb-3 text-sm text-[#355a4d]">
                    <p className="text-xs uppercase tracking-wide text-[#0a7d59]">Đợt #{departure.id}</p>
                    {isNearestUpcoming ? (
                      <p className="mt-1 inline-block rounded-full border border-[#8bd0b3] bg-[#e9fff4] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#0a7d59]">
                        Gần nhất sắp khởi hành
                      </p>
                    ) : null}
                    <p>
                      {formatDateVi(departure.departureDate)} → {formatDateVi(departure.returnDate)}
                    </p>
                  </div>

                  <form action={updateAdminDepartureAction} className="grid gap-3 md:grid-cols-5">
                    <input type="hidden" name="tourId" value={tour.id} />
                    <input type="hidden" name="departureId" value={departure.id} />

                    <label className="space-y-1 text-xs text-[#355a4d]">
                      Ngày đi
                      <input
                        name="departureDate"
                        type="date"
                        required
                        defaultValue={toDateInputValue(departure.departureDate)}
                        className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
                      />
                    </label>

                    <label className="space-y-1 text-xs text-[#355a4d]">
                      Ngày về
                      <input
                        name="returnDate"
                        type="date"
                        required
                        defaultValue={toDateInputValue(departure.returnDate)}
                        className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
                      />
                    </label>

                    <label className="space-y-1 text-xs text-[#355a4d]">
                      Giá (VND)
                      <input
                        name="price"
                        type="number"
                        min={1}
                        required
                        defaultValue={departure.price}
                        className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
                      />
                    </label>

                    <label className="space-y-1 text-xs text-[#355a4d]">
                      Tổng chỗ
                      <input
                        name="slotsTotal"
                        type="number"
                        min={1}
                        required
                        defaultValue={departure.slotsTotal}
                        className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
                      />
                    </label>

                    <label className="space-y-1 text-xs text-[#355a4d]">
                      Chỗ trống
                      <input
                        name="slotsAvailable"
                        type="number"
                        min={0}
                        required
                        defaultValue={departure.slotsAvailable}
                        className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]"
                      />
                    </label>

                    <div className="md:col-span-5 flex flex-wrap gap-2">
                      <button
                        type="submit"
                        className="rounded-xl bg-[#0a7d59] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#085a41]"
                      >
                        Lưu đợt khởi hành
                      </button>
                    </div>
                  </form>

                  <form action={deleteAdminDepartureAction} className="mt-2">
                    <input type="hidden" name="tourId" value={tour.id} />
                    <input type="hidden" name="departureId" value={departure.id} />
                    <ConfirmSubmitButton
                      message="Bạn có chắc muốn xóa đợt khởi hành này không?"
                      className="rounded-xl border border-[#f2c0b4] bg-[#fff7f5] px-3 py-2 text-xs font-semibold text-[#a93e23] transition hover:bg-[#ffece6]"
                    >
                      Xóa đợt này
                    </ConfirmSubmitButton>
                  </form>
                </article>
              );
            })}
          </div>
        )}

        <form action={createAdminDepartureAction} className="mt-5 grid gap-3 rounded-2xl border border-dashed border-[#9cd8c1] bg-[#f8fffb] p-4 md:grid-cols-5">
          <input type="hidden" name="tourId" value={tour.id} />

          <label className="space-y-1 text-xs text-[#355a4d]">
            Ngày đi
            <input name="departureDate" type="date" required className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-xs text-[#355a4d]">
            Ngày về
            <input name="returnDate" type="date" required className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-xs text-[#355a4d]">
            Giá (VND)
            <input name="price" type="number" min={1} required className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-xs text-[#355a4d]">
            Tổng chỗ
            <input name="slotsTotal" type="number" min={1} required className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-xs text-[#355a4d]">
            Chỗ trống
            <input name="slotsAvailable" type="number" min={0} required className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <div className="md:col-span-5">
            <button type="submit" className="rounded-xl bg-[#0a7d59] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#085a41]">
              + Thêm đợt khởi hành
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
