import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/auth-actions";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/tours", label: "Danh sách tour" },
  { href: "/bookings", label: "Đặt tour" },
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-[#f7fff9]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-[#074432]">
          TravelTo
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-[#26584a] transition hover:text-[#0a7d59]">
              {link.label}
            </Link>
          ))}
          {session?.user?.role === "ADMIN" ? (
            <Link href="/admin/bookings" className="rounded-full bg-[#083f30] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
              Admin
            </Link>
          ) : null}
        </nav>

        {session?.user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[#1c4d3f] md:block">{session.user.name}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-[#0a7d59] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#0a7d59] transition hover:bg-[#e4fff4]"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-[#0a7d59] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#085a41]"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}
