import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createPasswordAction } from "@/app/(auth)/set-password/actions";

interface SetPasswordPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getErrorMessage(errorCode?: string): string | null {
  if (errorCode === "length") {
    return "Mật khẩu phải từ 8 đến 72 ký tự.";
  }

  if (errorCode === "mismatch") {
    return "Mật khẩu xác nhận không khớp.";
  }

  if (errorCode === "failed") {
    return "Không thể tạo mật khẩu. Có thể tài khoản đã thiết lập mật khẩu trước đó.";
  }

  return null;
}

export default async function SetPasswordPage({ searchParams }: SetPasswordPageProps) {
  const session = await auth();

  if (!session?.user || !session.backendAccessToken) {
    redirect("/login");
  }

  if (session.user.passwordConfigured === true) {
    redirect("/");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const errorCode = typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : undefined;
  const errorMessage = getErrorMessage(errorCode);

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-[#cdece0] bg-white p-8 shadow-[0_18px_40px_rgba(10,93,66,0.08)] md:p-12">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Thiết lập lần đầu</p>
      <h1 className="mt-3 text-4xl font-bold text-[#083b2d] md:text-5xl">Tạo mật khẩu cho tài khoản của bạn</h1>
      <p className="mt-4 text-base text-[#32584c]">
        Tài khoản đang dùng email Google: <span className="font-semibold">{session.user.email}</span>. Sau khi tạo mật khẩu, bạn có thể đăng nhập bằng Google hoặc email + mật khẩu.
      </p>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-[#f4bfab] bg-[#fff4ef] px-4 py-3 text-base text-[#8d2b0d]">
          {errorMessage}
        </div>
      ) : null}

      <form action={createPasswordAction} className="mt-8 space-y-4">
        <label className="block space-y-2 text-base text-[#284f42]">
          <span>Mật khẩu mới</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            className="w-full rounded-2xl border border-[#9fdac4] bg-white px-4 py-3 outline-none focus:border-[#0a7d59]"
            placeholder="Tối thiểu 8 ký tự"
          />
        </label>

        <label className="block space-y-2 text-base text-[#284f42]">
          <span>Xác nhận mật khẩu</span>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            className="w-full rounded-2xl border border-[#9fdac4] bg-white px-4 py-3 outline-none focus:border-[#0a7d59]"
            placeholder="Nhập lại mật khẩu"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[#0a7d59] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#085a41]"
        >
          Lưu mật khẩu
        </button>
      </form>

      <p className="mt-5 text-center text-base text-[#3b6356]">
        Muốn quay lại trang chủ? <Link href="/" className="font-semibold text-[#0a7d59] hover:underline">Đi tới trang chủ</Link>
      </p>
    </div>
  );
}
