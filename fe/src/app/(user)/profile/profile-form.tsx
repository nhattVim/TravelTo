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
      router.refresh(); // Refresh to reflect new data
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`rounded-xl p-3 text-sm ${
            message.type === "success"
              ? "border border-[#81f0c0] bg-[#eafbf3] text-[#0a7d59]"
              : "border border-[#ff9f9f] bg-[#fff5f5] text-[#d14f4f]"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-semibold text-[#083b2d]">Email đăng nhập</label>
        <input
          type="email"
          value={initialProfile.email}
          disabled
          className="w-full rounded-xl border border-[#cdece0] bg-[#f8fffb] px-3 py-2 text-[#355a4d] opacity-70"
        />
        <p className="mt-1 text-xs text-[#528a75]">Email và vai trò không thể thay đổi.</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-[#083b2d]">Họ và tên</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
          disabled={loading}
          className="w-full rounded-xl border border-[#98d9c1] bg-white px-3 py-2 text-[#083b2d] focus:border-[#0a7d59] focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-[#083b2d]">Số điện thoại</label>
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          disabled={loading}
          className="w-full rounded-xl border border-[#98d9c1] bg-white px-3 py-2 text-[#083b2d] focus:border-[#0a7d59] focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-[#083b2d]">Địa chỉ</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={3}
          disabled={loading}
          className="w-full rounded-xl border border-[#98d9c1] bg-white px-3 py-2 text-[#083b2d] focus:border-[#0a7d59] focus:outline-none"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition ${
            loading ? "bg-[#8fd5bd]" : "bg-[#0a7d59] hover:bg-[#085a41]"
          }`}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
