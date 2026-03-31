"use client";

import { updateAdminUserRole } from "@/lib/api/private";
import { UserRole } from "@/types/travel";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserRoleActions({ token, userId, currentRole }: { token: string; userId: number; currentRole: UserRole }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    if (newRole === currentRole) return;
    
    if (!confirm(`Bạn có chắc muốn đổi vai trò thành ${newRole}?`)) {
      e.target.value = currentRole;
      return;
    }

    setLoading(true);
    try {
      await updateAdminUserRole(token, userId, newRole);
      router.refresh();
    } catch {
      alert("Đã xảy ra lỗi khi cập nhật.");
      e.target.value = currentRole;
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      defaultValue={currentRole}
      onChange={handleRoleChange}
      disabled={loading}
      className="rounded-lg border border-[#cdece0] bg-[#f8fffb] px-2 py-1 text-sm text-[#083b2d] outline-none transition focus:border-[#0a7d59]"
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
