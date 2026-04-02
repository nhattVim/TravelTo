"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Tổng quan", description: "Dashboard & thống kê" },
  { href: "/admin/users", label: "Quản lí user", description: "Phân quyền và thông tin" },
  { href: "/admin/tours", label: "Quản lí tour", description: "Danh sách và trạng thái" },
  { href: "/admin/bookings", label: "Quản lí booking", description: "Xác nhận và hủy đơn" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-fit rounded-3xl border border-[#cdece0] bg-white p-4 shadow-[0_18px_36px_rgba(9,88,61,0.08)]">
      <p className="px-3 pb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Admin Modules</p>
      <nav className="space-y-2">
        {adminLinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-2xl border px-3 py-3 transition ${isActive
                ? "border-[#8ed5be] bg-[#e8fff4] text-[#0d3d30]"
                : "border-[#e0f2ea] bg-[#fafffd] text-[#2d5a4d] hover:border-[#a9e0ca] hover:bg-[#f0fff8]"
                }`}
            >
              <p className="text-base font-semibold">{item.label}</p>
              <p className="mt-1 text-sm opacity-80">{item.description}</p>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
