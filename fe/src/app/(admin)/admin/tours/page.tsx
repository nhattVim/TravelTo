import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createAdminTourAction, deleteAdminTourAction, updateAdminTourAction } from "@/app/(admin)/admin/tours/actions";
import { ApiHttpError } from "@/lib/api/client";
import { getAdminTourDetail, getAdminTours } from "@/lib/api/private";
import { formatCurrencyVnd, formatDateVi } from "@/lib/format";
import { getProvinceOverview } from "@/lib/api/public";
import { AdminTourDetail } from "@/types/travel";

interface AdminToursPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function pickSingle(value: string | string[] | undefined): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

function parseTourId(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }

  return numeric;
}

function buildFeedback(params: Record<string, string | string[] | undefined>): string | null {
  const error = pickSingle(params.error);
  if (error) {
    if (error === "invalid-form") {
      return "Biểu mẫu chưa hợp lệ. Vui lòng kiểm tra lại các trường bắt buộc.";
    }
    if (error === "invalid-tour-id") {
      return "Tour không hợp lệ.";
    }

    try {
      return decodeURIComponent(error);
    } catch {
      return "Đã có lỗi xảy ra khi thao tác tour.";
    }
  }

  if (pickSingle(params.saved) === "1") {
    return "Đã tạo tour mới thành công.";
  }
  if (pickSingle(params.updated) === "1") {
    return "Đã cập nhật tour thành công.";
  }
  if (pickSingle(params.deleted) === "1") {
    return "Đã xóa tour thành công.";
  }

  return null;
}

function isCreateMode(value: string | undefined): boolean {
  return value === "create";
}

function statusBadgeClass(status: string): string {
  if (status === "PUBLISHED") {
    return "border-[#95d8bf] bg-[#e8fff4] text-[#086447]";
  }
  return "border-[#f0cd94] bg-[#fff7e7] text-[#7d4d1a]";
}

function defaultImageUrls(detail: AdminTourDetail | null): string {
  if (!detail?.imageUrls?.length) {
    return "";
  }

  return detail.imageUrls.join("\n");
}

export default async function AdminToursPage({ searchParams }: AdminToursPageProps) {
  const session = await auth();
  if (!session?.backendAccessToken || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const requestedTourId = parseTourId(pickSingle(resolvedSearchParams.tourId));
  const createMode = isCreateMode(pickSingle(resolvedSearchParams.mode));

  const [tourData, provinces] = await Promise.all([
    getAdminTours(session.backendAccessToken, { page: 0, size: 200 }).catch((error) => {
      if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
        redirect("/login?reason=session-expired");
      }
      throw error;
    }),
    getProvinceOverview(),
  ]);

  const fallbackTourId = !createMode && !requestedTourId && tourData.items.length > 0
    ? tourData.items[0].id
    : null;
  const selectedTourId = requestedTourId ?? fallbackTourId;

  let selectedTour: AdminTourDetail | null = null;
  if (selectedTourId) {
    selectedTour = await getAdminTourDetail(session.backendAccessToken, selectedTourId).catch((error) => {
      if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
        redirect("/login?reason=session-expired");
      }
      return null;
    });
  }

  const isEditMode = !createMode && !!selectedTour;
  const feedbackMessage = buildFeedback(resolvedSearchParams);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Tour Management</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#083b2d]">Quản lí tour</h2>
          <p className="mt-2 text-sm text-[#355a4d]">
            Quản trị toàn bộ dữ liệu tour: xem chi tiết, tạo mới, cập nhật và xóa tour.
          </p>
        </div>
        <Link
          href="/admin/tours?mode=create"
          className="rounded-2xl bg-[#0a7d59] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#085a41]"
        >
          + Thêm tour mới
        </Link>
      </header>

      {feedbackMessage ? (
        <section className="rounded-2xl border border-[#bfe4d2] bg-[#effff7] px-4 py-3 text-sm text-[#1f5847]">
          {feedbackMessage}
        </section>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <div className="space-y-4 rounded-2xl border border-[#cdece0] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-[#083b2d]">Danh sách tour</h3>
            <p className="text-sm text-[#355a4d]">{tourData.totalElements} tour</p>
          </div>

          {tourData.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#98d8c0] bg-[#f8fffb] p-6 text-sm text-[#355a4d]">
              Chưa có tour nào.
            </div>
          ) : (
            <div className="space-y-3">
              {tourData.items.map((tour) => (
                <article key={tour.id} className="rounded-2xl border border-[#d8efe6] bg-[#fbfffd] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-[#0a7d59]">#{tour.id} • {tour.provinceName}</p>
                      <h4 className="text-base font-semibold text-[#083b2d]">{tour.title}</h4>
                      <p className="text-sm text-[#355a4d]">{tour.departureLocation} → {tour.destinationLocation}</p>
                      <p className="text-sm text-[#355a4d]">{formatCurrencyVnd(tour.price)} • {tour.days}N{tour.nights}Đ</p>
                    </div>

                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass(tour.status)}`}>
                      {tour.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/admin/tours?tourId=${tour.id}`}
                      className="rounded-xl border border-[#9ad9bf] bg-white px-3 py-2 text-xs font-semibold text-[#0a7d59] transition hover:bg-[#f1fff8]"
                    >
                      Xem chi tiết
                    </Link>
                    <Link
                      href={`/admin/tours?mode=edit&tourId=${tour.id}`}
                      className="rounded-xl border border-[#9ad9bf] bg-white px-3 py-2 text-xs font-semibold text-[#0a7d59] transition hover:bg-[#f1fff8]"
                    >
                      Sửa
                    </Link>
                    <form action={deleteAdminTourAction}>
                      <input type="hidden" name="tourId" value={tour.id} />
                      <button
                        type="submit"
                        className="rounded-xl border border-[#f2c0b4] bg-[#fff7f5] px-3 py-2 text-xs font-semibold text-[#a93e23] transition hover:bg-[#ffece6]"
                      >
                        Xóa
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-[#cdece0] bg-white p-5">
            <h3 className="text-lg font-semibold text-[#083b2d]">
              {isEditMode ? `Cập nhật tour #${selectedTour?.id}` : "Tạo tour mới"}
            </h3>

            <form action={isEditMode ? updateAdminTourAction : createAdminTourAction} className="mt-4 space-y-3">
              {isEditMode && selectedTour ? <input type="hidden" name="tourId" value={selectedTour.id} /> : null}

              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-1 text-sm text-[#315748]">
                  <span>Tỉnh / Thành</span>
                  <select
                    name="provinceCode"
                    defaultValue={selectedTour?.provinceCode ?? ""}
                    required
                    className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                  >
                    <option value="">Chọn tỉnh</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 text-sm text-[#315748]">
                  <span>Trạng thái</span>
                  <select
                    name="status"
                    defaultValue={selectedTour?.status ?? "PUBLISHED"}
                    required
                    className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </label>
              </div>

              <label className="space-y-1 text-sm text-[#315748]">
                <span>Tên tour</span>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedTour?.title ?? ""}
                  required
                  className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm text-[#315748]">
                <span>Tóm tắt</span>
                <input
                  type="text"
                  name="summary"
                  defaultValue={selectedTour?.summary ?? ""}
                  required
                  className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm text-[#315748]">
                <span>Mô tả chi tiết</span>
                <textarea
                  name="description"
                  defaultValue={selectedTour?.description ?? ""}
                  required
                  rows={4}
                  className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                />
              </label>

              <div className="grid gap-3 md:grid-cols-3">
                <label className="space-y-1 text-sm text-[#315748]">
                  <span>Giá</span>
                  <input
                    type="number"
                    step="1000"
                    min={1}
                    name="price"
                    defaultValue={selectedTour?.price ?? ""}
                    required
                    className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                  />
                </label>

                <label className="space-y-1 text-sm text-[#315748]">
                  <span>Số ngày</span>
                  <input
                    type="number"
                    min={1}
                    name="days"
                    defaultValue={selectedTour?.days ?? 1}
                    required
                    className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                  />
                </label>

                <label className="space-y-1 text-sm text-[#315748]">
                  <span>Số đêm</span>
                  <input
                    type="number"
                    min={0}
                    name="nights"
                    defaultValue={selectedTour?.nights ?? 0}
                    required
                    className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-1 text-sm text-[#315748]">
                  <span>Điểm khởi hành</span>
                  <input
                    type="text"
                    name="departureLocation"
                    defaultValue={selectedTour?.departureLocation ?? ""}
                    required
                    className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                  />
                </label>

                <label className="space-y-1 text-sm text-[#315748]">
                  <span>Điểm đến</span>
                  <input
                    type="text"
                    name="destinationLocation"
                    defaultValue={selectedTour?.destinationLocation ?? ""}
                    required
                    className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                  />
                </label>
              </div>

              <label className="space-y-1 text-sm text-[#315748]">
                <span>Ảnh đại diện (URL)</span>
                <input
                  type="text"
                  name="imageUrl"
                  defaultValue={selectedTour?.imageUrl ?? ""}
                  className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm text-[#315748]">
                <span>Danh sách ảnh (mỗi dòng 1 URL)</span>
                <textarea
                  name="imageUrls"
                  defaultValue={defaultImageUrls(selectedTour)}
                  rows={4}
                  className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-1 text-sm text-[#315748]">
                  <span>Điểm tham quan</span>
                  <input
                    type="text"
                    name="attractions"
                    defaultValue={selectedTour?.additionalInfo?.attractions ?? ""}
                    className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                  />
                </label>
                <label className="space-y-1 text-sm text-[#315748]">
                  <span>Ẩm thực</span>
                  <input
                    type="text"
                    name="cuisine"
                    defaultValue={selectedTour?.additionalInfo?.cuisine ?? ""}
                    className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                  />
                </label>
                <label className="space-y-1 text-sm text-[#315748]">
                  <span>Phù hợp</span>
                  <input
                    type="text"
                    name="suitableFor"
                    defaultValue={selectedTour?.additionalInfo?.suitableFor ?? ""}
                    className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                  />
                </label>
                <label className="space-y-1 text-sm text-[#315748]">
                  <span>Thời điểm đẹp</span>
                  <input
                    type="text"
                    name="idealTime"
                    defaultValue={selectedTour?.additionalInfo?.idealTime ?? ""}
                    className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                  />
                </label>
                <label className="space-y-1 text-sm text-[#315748]">
                  <span>Phương tiện</span>
                  <input
                    type="text"
                    name="transport"
                    defaultValue={selectedTour?.additionalInfo?.transport ?? ""}
                    className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                  />
                </label>
                <label className="space-y-1 text-sm text-[#315748]">
                  <span>Khuyến mãi</span>
                  <input
                    type="text"
                    name="promotion"
                    defaultValue={selectedTour?.additionalInfo?.promotion ?? ""}
                    className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                  />
                </label>
              </div>

              <label className="space-y-1 text-sm text-[#315748]">
                <span>Ghi chú</span>
                <textarea
                  name="notes"
                  defaultValue={selectedTour?.additionalInfo?.notes ?? ""}
                  rows={3}
                  className="w-full rounded-xl border border-[#9dd8c2] bg-white px-3 py-2"
                />
              </label>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="submit"
                  className="rounded-xl bg-[#0a7d59] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#085a41]"
                >
                  {isEditMode ? "Lưu thay đổi" : "Tạo tour"}
                </button>
                <Link
                  href="/admin/tours?mode=create"
                  className="rounded-xl border border-[#9dd8c2] px-4 py-2 text-sm font-semibold text-[#0a7d59] transition hover:bg-[#effff7]"
                >
                  Làm mới form
                </Link>
              </div>
            </form>
          </section>

          {selectedTour ? (
            <section className="rounded-2xl border border-[#cdece0] bg-white p-5">
              <h3 className="text-lg font-semibold text-[#083b2d]">Chi tiết tour #{selectedTour.id}</h3>
              <p className="mt-2 text-sm text-[#355a4d]">{selectedTour.title}</p>
              <div className="mt-3 grid gap-2 text-sm text-[#355a4d]">
                <p>Tỉnh: {selectedTour.provinceName}</p>
                <p>Giá: {formatCurrencyVnd(selectedTour.price)}</p>
                <p>Slots: {selectedTour.slotsAvailable} / {selectedTour.slotsTotal}</p>
                <p>Cập nhật lần cuối: {formatDateVi(selectedTour.updatedAt)}</p>
              </div>

              <div className="mt-4 rounded-xl border border-[#e3f3ec] bg-[#f9fffc] p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0a7d59]">Các đợt khởi hành</p>
                {selectedTour.departures.length === 0 ? (
                  <p className="mt-2 text-sm text-[#355a4d]">Chưa có đợt khởi hành cho tour này.</p>
                ) : (
                  <div className="mt-2 space-y-1 text-sm text-[#355a4d]">
                    {selectedTour.departures.map((departure) => (
                      <p key={departure.id}>
                        {formatDateVi(departure.departureDate)} - {formatDateVi(departure.returnDate)} • {formatCurrencyVnd(departure.price)} • {departure.slotsAvailable}/{departure.slotsTotal} chỗ
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}
