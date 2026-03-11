import Link from "next/link";
import { signInWithGoogleAction } from "@/lib/auth-actions";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-[#cdece0] bg-white p-8 shadow-[0_18px_40px_rgba(10,93,66,0.08)] md:p-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Authentication</p>
      <h1 className="mt-3 text-3xl font-bold text-[#083b2d] md:text-4xl">Đăng nhập để đặt tour du lịch</h1>
      <p className="mt-4 text-sm text-[#32584c]">
        Hệ thống sử dụng Google để đăng nhập và tự động tạo tài khoản. Quyền USER hoặc ADMIN được phân theo email cấu hình ở backend.
      </p>

      <form action={signInWithGoogleAction} className="mt-8">
        <button
          type="submit"
          className="w-full rounded-2xl bg-[#0a7d59] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#085a41]"
        >
          Tiếp tục với Google
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-[#3b6356]">
        Chưa muốn đăng nhập? <Link href="/" className="font-semibold text-[#0a7d59] hover:underline">Về trang chủ</Link>
      </p>
    </div>
  );
}
