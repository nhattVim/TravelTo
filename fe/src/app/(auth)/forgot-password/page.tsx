"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset, resetPasswordWithOtp } from "@/lib/api/public";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const res = await requestPasswordReset(email);
      // Backend might return HTTP 400 if validation fails, which would throw ApiHttpError
      // Or it returns success: true inside the payload. Let's handle it properly.
      if (res && res.success === false) {
        throw new Error(res.message);
      }
      setStep(2);
      setError("");
    } catch (err: any) {
      // Assuming the payload throws an ApiHttpError with a message property or a payload property map.
      setError(err.payload?.message || err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ các trường.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await resetPasswordWithOtp(email, otp, newPassword, confirmPassword);
      if (res && res.success === false) {
        throw new Error(res.message);
      }
      setSuccess(true);
      setError("");
    } catch (err: any) {
      setError(err.payload?.message || err.message || "OTP không hợp lệ hoặc đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-[#cdece0] bg-white p-6 shadow-[0_18px_40px_rgba(10,93,66,0.08)] md:p-8 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4fff4] text-[#0a7d59]">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-[#083b2d]">Đổi mật khẩu thành công</h1>
            <p className="mt-2 text-[#32584c]">Bạn có thể đăng nhập bằng mật khẩu mới của mình.</p>
          </div>
          <Link
            href="/login"
            className="w-full rounded-2xl bg-[#083f30] py-3.5 text-center text-base font-semibold text-white transition hover:bg-[#062d22]"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-[#cdece0] bg-white p-6 shadow-[0_18px_40px_rgba(10,93,66,0.08)] md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Khôi phục mật khẩu</p>
      <h1 className="mt-2 text-3xl font-bold text-[#083b2d] md:text-4xl">
        {step === 1 ? "Nhập Email" : "Nhập Mã OTP"}
      </h1>
      <p className="mt-3 text-sm text-[#32584c]">
        {step === 1 ? "Nhập email của bạn để nhận mã xác minh." : "Nhập mã xác minh được gửi tới email của bạn."}
      </p>

      {error ? (
        <div className="mt-4 rounded-2xl border border-[#f4bfab] bg-[#fff4ef] px-4 py-3 text-base text-[#8d2b0d]">
          {error}
        </div>
      ) : null}

      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="mt-6 space-y-4">
          <label className="block space-y-1.5 text-base text-[#284f42]">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#9fdac4] bg-white px-4 py-2.5 outline-none focus:border-[#0a7d59]"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#083f30] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#062d22] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Đang gửi..." : "Gửi mã OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
          <label className="block space-y-1.5 text-base text-[#284f42]">
            <span>Mã xác minh (OTP)</span>
            <input
              type="text"
              placeholder="Ví dụ: 1234"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-2xl border border-[#9fdac4] bg-white px-4 py-2.5 outline-none focus:border-[#0a7d59] tracking-widest"
              required
            />
          </label>

          <label className="block space-y-1.5 text-base text-[#284f42]">
            <span>Mật khẩu mới</span>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-2xl border border-[#9fdac4] bg-white px-4 py-2.5 outline-none focus:border-[#0a7d59]"
              required
            />
          </label>

          <label className="block space-y-1.5 text-base text-[#284f42]">
            <span>Xác nhận mật khẩu</span>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-[#9fdac4] bg-white px-4 py-2.5 outline-none focus:border-[#0a7d59]"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#083f30] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#062d22] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>
          
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full rounded-2xl bg-[#f0f9f5] px-6 py-3.5 text-base font-semibold text-[#0a7d59] transition hover:bg-[#e4fff4]"
          >
            Quay lại bước nhập Email
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-sm text-[#3b6356]">
        Nhớ mật khẩu? <Link href="/login" className="font-semibold text-[#0a7d59] hover:underline">Đăng nhập ngay</Link>
      </p>
    </div>
  );
}
