"use client";

import { updateUserProfile } from "@/lib/api/private";
import { UserProfileDto } from "@/types/travel";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProfileForm({
  initialProfile,
  token,
}: {
  initialProfile: UserProfileDto;
  token: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: initialProfile.fullName,
    phone: initialProfile.phone || "",
    address: initialProfile.address || "",
    avatarUrl: initialProfile.avatarUrl || "",
    gender: initialProfile.gender || "",
    dateOfBirth: initialProfile.dateOfBirth || "",
    identityCard: initialProfile.identityCard || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setMessage({ type: "error", text: "Họ và tên không được để trống." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await updateUserProfile(token, formData);
      setMessage({ type: "success", text: "Cập nhật thông tin thành công." });
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage({ type: "error", text: err.message || "Đã xảy ra lỗi khi cập nhật." });
      } else {
        setMessage({ type: "error", text: "Đã xảy ra lỗi khi cập nhật." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-[#eafbf3] pb-4">
        <h2 className="text-xl font-bold text-[#083b2d]">Thông tin cá nhân</h2>
        <p className="mt-1 text-sm text-[#355a4d]">
          Cập nhật thông tin của bạn và tìm hiểu các thông tin này được sử dụng ra sao.
        </p>
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 text-sm font-medium ${
            message.type === "success"
              ? "border border-[#81f0c0] bg-[#eafbf3] text-[#0a7d59]"
              : "border border-[#ff9f9f] bg-[#fff5f5] text-[#d14f4f]"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#083b2d]">Họ và tên</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            disabled={loading}
            className="w-full rounded-2xl border border-[#cdece0] bg-[#fcfdfd] px-4 py-3 text-[#083b2d] shadow-sm transition focus:border-[#0a7d59] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a7d59]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#083b2d]">Giới tính</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            disabled={loading}
            className="w-full rounded-2xl border border-[#cdece0] bg-[#fcfdfd] px-4 py-3 text-[#083b2d] shadow-sm transition focus:border-[#0a7d59] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a7d59]"
          >
            <option value="">Chưa cập nhật</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#083b2d]">Ngày sinh</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            disabled={loading}
            className="w-full rounded-2xl border border-[#cdece0] bg-[#fcfdfd] px-4 py-3 text-[#083b2d] shadow-sm transition focus:border-[#0a7d59] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a7d59]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#083b2d]">Số điện thoại</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={loading}
            placeholder="Ví dụ: 0987654321"
            className="w-full rounded-2xl border border-[#cdece0] bg-[#fcfdfd] px-4 py-3 text-[#083b2d] shadow-sm transition focus:border-[#0a7d59] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a7d59]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#083b2d]">Email đăng nhập</label>
          <input
            type="email"
            value={initialProfile.email}
            disabled
            className="w-full cursor-not-allowed rounded-2xl border border-[#cdece0] bg-[#f2fdf8] px-4 py-3 text-[#355a4d] opacity-70 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#083b2d]">Căn cước công dân / CMND</label>
          <input
            type="text"
            value={formData.identityCard}
            onChange={(e) => setFormData({ ...formData, identityCard: e.target.value })}
            disabled={loading}
            placeholder="Số thẻ căn cước"
            className="w-full rounded-2xl border border-[#cdece0] bg-[#fcfdfd] px-4 py-3 text-[#083b2d] shadow-sm transition focus:border-[#0a7d59] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a7d59]"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-[#083b2d]">Địa chỉ</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={2}
            disabled={loading}
            placeholder="Số nhà, đường, quận/huyện..."
            className="w-full rounded-2xl border border-[#cdece0] bg-[#fcfdfd] px-4 py-3 text-[#083b2d] shadow-sm transition focus:border-[#0a7d59] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a7d59]"
          />
        </div>
      </div>

      <div className="flex justify-end pt-5">
        <button
          type="submit"
          disabled={loading}
          className={`rounded-2xl px-10 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-md transition ${
            loading ? "cursor-not-allowed bg-[#8fd5bd]" : "bg-[#0a7d59] hover:bg-[#085a41] hover:shadow-lg"
          }`}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
