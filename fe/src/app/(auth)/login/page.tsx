import Link from "next/link";
import { signInWithCredentialsAction, signInWithGoogleAction } from "@/lib/auth-actions";

interface LoginPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getErrorText(errorCode?: string): string | null {
  if (errorCode === "missing") {
    return "Vui lòng nhập đầy đủ email và mật khẩu.";
  }

  if (errorCode === "invalid") {
    return "Email hoặc mật khẩu không chính xác, hoặc tài khoản chưa tạo mật khẩu.";
  }

  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const errorCode = typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : undefined;
  const errorText = getErrorText(errorCode);

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-[#cdece0] bg-white p-8 shadow-[0_18px_40px_rgba(10,93,66,0.08)] md:p-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Authentication</p>
      <h1 className="mt-3 text-3xl font-bold text-[#083b2d] md:text-4xl">Đăng nhập để đặt tour du lịch</h1>
      <p className="mt-4 text-sm text-[#32584c]">
        Lần đầu bạn đăng nhập bằng Google để hệ thống tạo tài khoản theo email Google. Sau đó có thể dùng Google hoặc email + mật khẩu để đăng nhập.
      </p>

      {errorText ? (
        <div className="mt-4 rounded-2xl border border-[#f4bfab] bg-[#fff4ef] px-4 py-3 text-sm text-[#8d2b0d]">
          {errorText}
        </div>
      ) : null}

      <form action={signInWithCredentialsAction} className="mt-8 space-y-4">
        <label className="block space-y-2 text-sm text-[#284f42]">
          <span>Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="w-full rounded-2xl border border-[#9fdac4] bg-white px-4 py-3 outline-none focus:border-[#0a7d59]"
            placeholder="you@gmail.com"
          />
        </label>

        <label className="block space-y-2 text-sm text-[#284f42]">
          <span>Mật khẩu</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full rounded-2xl border border-[#9fdac4] bg-white px-4 py-3 outline-none focus:border-[#0a7d59]"
            placeholder="Nhập mật khẩu của bạn"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[#083f30] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#062d22]"
        >
          Đăng nhập bằng Email + Mật khẩu
        </button>
      </form>

      <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#6d998b]">
        <span className="h-px flex-1 bg-[#d6efe6]" />
        Hoặc
        <span className="h-px flex-1 bg-[#d6efe6]" />
      </div>

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
