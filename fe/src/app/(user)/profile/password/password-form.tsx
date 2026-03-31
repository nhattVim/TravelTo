"use client";

import { changePassword } from "@/lib/api/private";
import { useState } from "react";

export function PasswordForm({ token }: { token: string }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự." });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu nhập lại không khớp." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await changePassword(token, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      setMessage({ type: "success", text: "Đổi mật khẩu thành công." });
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage({ type: "error", text: err.message || "Lỗi khi đổi mật khẩu (Mật khẩu cũ không chính xác)." });
      } else {
        setMessage({ type: "error", text: "Đã xảy ra lỗi không xác định." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-[#eafbf3] pb-4">
        <h2 className="text-xl font-bold text-[#083b2d]">Đổi mật khẩu</h2>
        <p className="mt-1 text-sm text-[#355a4d]">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.
        </p>
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 text-sm font-medium ${
            message.type === "success"
              ? "bg-[#eafbf3] text-[#0a7d59] border border-[#a2ecd0]"
              : "bg-[#fff5f5] text-[#d14f4f] border border-[#ffb3b3]"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-5 max-w-xl">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#083b2d]">Mật khẩu cũ</label>
          <input
            type="password"
            value={formData.oldPassword}
            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
            required
            disabled={loading}
            placeholder="Nhập mật khẩu cũ"
            className="w-full rounded-2xl border border-[#cdece0] bg-[#fcfdfd] px-4 py-3 text-[#083b2d] shadow-sm transition focus:border-[#0a7d59] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a7d59]"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#083b2d]">Mật khẩu mới</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
              disabled={loading}
              placeholder="Nhập mật khẩu mới"
              className="w-full rounded-2xl border border-[#cdece0] bg-[#fcfdfd] px-4 py-3 text-[#083b2d] shadow-sm transition focus:border-[#0a7d59] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a7d59]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#083b2d]">Nhập lại mật khẩu mới</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={loading}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full rounded-2xl border border-[#cdece0] bg-[#fcfdfd] px-4 py-3 text-[#083b2d] shadow-sm transition focus:border-[#0a7d59] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a7d59]"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className={`rounded-2xl px-10 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-md transition ${
            loading ? "cursor-not-allowed bg-[#8fd5bd]" : "bg-[#0a7d59] hover:bg-[#075f43] hover:shadow-lg"
          }`}
        >
          {loading ? "ĐANG LƯU..." : "ĐỔI MẬT KHẨU"}
        </button>
      </div>
    </form>
  );
}
