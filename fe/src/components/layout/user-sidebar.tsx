"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function UserSidebar({ user }: UserSidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="space-y-6">
      <div className="flex items-center gap-4 rounded-3xl border border-[#cbeadf] bg-white p-5 shadow-[0_8px_16px_rgba(12,85,62,0.03)] lg:p-6">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0a7d59] text-xl font-bold text-white shadow-inner">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="overflow-hidden">
          <h3 className="truncate font-semibold text-[#083b2d]">{user.name}</h3>
          <p className="truncate text-xs text-[#355a4d]">{user.email}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 rounded-3xl border border-[#cbeadf] bg-white p-3 shadow-[0_8px_16px_rgba(12,85,62,0.03)]">
        <div className="px-3 pb-2 pt-3 text-xs font-bold uppercase tracking-widest text-[#0a7d59]">
          Tài khoản
        </div>
        <Link 
          href="/profile" 
          className={`rounded-2xl px-4 py-3 text-sm transition ${isActive("/profile") ? "bg-[#e4fff4] text-[#0a7d59] font-bold" : "font-medium text-[#26584a] hover:bg-[#f2fdf8] hover:text-[#0a7d59]"}`}
        >
          Thông tin cá nhân
        </Link>
        <Link 
          href="/profile/password" 
          className={`rounded-2xl px-4 py-3 text-sm transition ${isActive("/profile/password") ? "bg-[#e4fff4] text-[#0a7d59] font-bold" : "font-medium text-[#26584a] hover:bg-[#f2fdf8] hover:text-[#0a7d59]"}`}
        >
          Đổi mật khẩu
        </Link>
        <Link 
          href="/profile/delete" 
          className={`rounded-2xl px-4 py-3 text-sm transition ${isActive("/profile/delete") ? "bg-[#fff5f5] text-[#d14f4f] font-bold" : "font-medium text-[#d14f4f] hover:bg-[#fff5f5]"}`}
        >
          Yêu cầu xóa tài khoản
        </Link>

        <div className="mt-2 border-t border-[#eafbf3] px-3 pb-2 pt-4 text-xs font-bold uppercase tracking-widest text-[#0a7d59]">
          Giao dịch & Tương tác
        </div>
        <Link 
          href="/bookings" 
          className={`rounded-2xl px-4 py-3 text-sm transition ${isActive("/bookings") ? "bg-[#e4fff4] text-[#0a7d59] font-bold" : "font-medium text-[#26584a] hover:bg-[#f2fdf8] hover:text-[#0a7d59]"}`}
        >
          Đơn đặt chỗ
        </Link>
        <Link 
          href="/wishlists" 
          className={`rounded-2xl px-4 py-3 text-sm transition ${isActive("/wishlists") ? "bg-[#e4fff4] text-[#0a7d59] font-bold" : "font-medium text-[#26584a] hover:bg-[#f2fdf8] hover:text-[#0a7d59]"}`}
        >
          Yêu thích đã lưu
        </Link>
      </nav>
    </aside>
  );
}
