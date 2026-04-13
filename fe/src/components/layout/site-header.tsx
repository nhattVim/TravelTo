import { auth } from "@/auth";
import { signOutAction } from "@/lib/auth-actions";
import Image from "next/image";
import Link from "next/link";

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
        <Link href="/" className="text-xl font-bold tracking-tight text-[#074432]">
          TravelTo
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-base font-medium text-[#26584a] transition hover:text-[#0a7d59]">
              {link.label}
            </Link>
          ))}
        </nav>

        {session?.user ? (
          <div className="group relative">
            <Link href="/profile" className="flex cursor-pointer items-center gap-3 py-2">
              <div className="flex overflow-hidden h-9 w-9 items-center justify-center rounded-full bg-[#0a7d59] font-bold text-white shadow-sm ring-2 ring-[#e4fff4] transition group-hover:ring-[#0a7d59]">
                {session?.user?.image ? (
                  <Image src={session.user.image} alt={session.user.name || "Avatar"} width={36} height={36} className="h-full w-full object-cover" />
                ) : (
                  session?.user?.name?.charAt(0)?.toUpperCase()
                )}
              </div>
              <span className="hidden text-base font-semibold text-[#1c4d3f] transition group-hover:text-[#0a7d59] md:block">
                {session.user.name}
              </span>
            </Link>

            <div className="absolute right-0 top-full hidden w-52 flex-col overflow-hidden rounded-2xl border border-[#cdece0] bg-white p-2 shadow-[0_12px_24px_rgba(10,125,89,0.1)] group-hover:flex">
              <Link
                href="/profile"
                className="rounded-xl px-4 py-2.5 text-base font-medium text-[#26584a] transition hover:bg-[#e4fff4] hover:text-[#0a7d59]"
              >
                Hồ sơ của tôi
              </Link>
              <Link
                href="/bookings"
                className="rounded-xl px-4 py-2.5 text-base font-medium text-[#26584a] transition hover:bg-[#e4fff4] hover:text-[#0a7d59]"
              >
                Chuyến đi của tôi
              </Link>
              <div className="my-1 h-px w-full bg-[#eafbf3]" />
              <form action={signOutAction} className="w-full">
                <button
                  type="submit"
                  className="w-full rounded-xl px-4 py-2.5 text-left text-base font-medium text-[#d14f4f] transition hover:bg-[#fff5f5]"
                >
                  Đăng xuất
                </button>
              </form>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-[#0a7d59] px-4 py-2 text-sm font-semibold tracking-wide text-white transition hover:bg-[#085a41]"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}
