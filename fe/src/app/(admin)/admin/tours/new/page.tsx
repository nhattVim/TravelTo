import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createAdminTourAction } from "@/app/(admin)/admin/tours/actions";


interface AdminTourNewPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function pickSingle(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function feedbackText(params: Record<string, string | string[] | undefined>): string | null {
  const error = pickSingle(params.error);
  if (!error) {
    return null;
  }
  if (error === "invalid-form") {
    return "Vui lòng kiểm tra lại dữ liệu tour.";
  }
  try {
    return decodeURIComponent(error);
  } catch {
    return "Đã có lỗi xảy ra.";
  }
}

export default async function AdminTourNewPage({ searchParams }: AdminTourNewPageProps) {
  const session = await auth();
  if (!session?.backendAccessToken || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const params = searchParams ? await searchParams : {};
  const feedback = feedbackText(params);
  const provincesRes = await fetch("https://provinces.open-api.vn/api/v2/p/");
  const rawProvinces: { name: string; codename: string; code: number }[] = await provincesRes.json();
  const provinces = rawProvinces.map(p => ({ code: p.codename, name: p.name }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Tour Management</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#083b2d]">Tạo tour mới</h2>
        </div>

        <Link
          href="/admin/tours"
          className="rounded-xl border border-[#9ad9bf] bg-white px-4 py-2 text-sm font-semibold text-[#0a7d59] transition hover:bg-[#f1fff8]"
        >
          ← Quay lại danh sách
        </Link>
      </header>

      {feedback ? (
        <section className="rounded-2xl border border-[#f0c5b8] bg-[#fff5f2] px-4 py-3 text-sm text-[#7a3724]">{feedback}</section>
      ) : null}

      <form action={createAdminTourAction} className="space-y-5 rounded-2xl border border-[#cdece0] bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm text-[#355a4d]">
            Tỉnh / Thành
            <select name="provinceData" required className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]">
              <option value="">Chọn tỉnh thành</option>
              {provinces.map((province) => (
                <option key={province.code} value={`${province.code}|${province.name}`}>
                  {province.name} ({province.code})
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm text-[#355a4d]">
            Trạng thái
            <select name="status" defaultValue="PUBLISHED" className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]">
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="DRAFT">DRAFT</option>
            </select>
          </label>

          <label className="space-y-1 text-sm text-[#355a4d] md:col-span-2">
            Tiêu đề tour
            <input name="title" required className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-sm text-[#355a4d] md:col-span-2">
            Tóm tắt
            <textarea name="summary" required rows={2} className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-sm text-[#355a4d] md:col-span-2">
            Mô tả chi tiết
            <textarea name="description" required rows={5} className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-sm text-[#355a4d]">
            Giá cơ bản (VND)
            <input name="price" type="number" min={1} required className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-sm text-[#355a4d]">
              Số ngày
              <input name="days" type="number" min={1} required className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
            </label>
            <label className="space-y-1 text-sm text-[#355a4d]">
              Số đêm
              <input name="nights" type="number" min={0} required className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
            </label>
          </div>

          <label className="space-y-1 text-sm text-[#355a4d]">
            Điểm khởi hành
            <select name="departureLocation" required className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]">
              <option value="">Chọn điểm khởi hành</option>
              {provinces.map((p) => (
                <option key={`dep-${p.code}`} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm text-[#355a4d]">
            Điểm đến
            <select name="destinationLocation" required className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]">
              <option value="">Chọn điểm đến</option>
              {provinces.map((p) => (
                <option key={`dest-${p.code}`} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm text-[#355a4d] md:col-span-2">
            Ảnh đại diện (URL)
            <input name="imageUrl" className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-sm text-[#355a4d] md:col-span-2">
            Danh sách ảnh (mỗi dòng 1 URL)
            <textarea name="imageUrls" rows={3} className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-sm text-[#355a4d]">
            Điểm nổi bật
            <textarea name="attractions" rows={2} className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-sm text-[#355a4d]">
            Ẩm thực
            <textarea name="cuisine" rows={2} className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-sm text-[#355a4d]">
            Phù hợp với
            <textarea name="suitableFor" rows={2} className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-sm text-[#355a4d]">
            Thời điểm lý tưởng
            <textarea name="idealTime" rows={2} className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-sm text-[#355a4d]">
            Di chuyển
            <textarea name="transport" rows={2} className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-sm text-[#355a4d]">
            Khuyến mãi
            <textarea name="promotion" rows={2} className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>

          <label className="space-y-1 text-sm text-[#355a4d] md:col-span-2">
            Ghi chú
            <textarea name="notes" rows={3} className="w-full rounded-xl border border-[#a7d9c5] px-3 py-2 text-sm text-[#123d31]" />
          </label>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="rounded-xl bg-[#0a7d59] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#085a41]">
            Tạo tour
          </button>
        </div>
      </form>
    </div>
  );
}
