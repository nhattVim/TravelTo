"use client";

import { removeWishlist } from "@/lib/api/private";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function WishlistActions({ token, tourId }: { token: string; tourId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    if (!confirm("Bạn có chắc muốn xóa tour khỏi danh sách yêu thích?")) return;
    setLoading(true);
    try {
      await removeWishlist(token, tourId);
      router.refresh();
    } catch {
      alert("Lỗi khi xóa tour yêu thích.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className={`rounded-xl border border-[#ff9f9f] bg-[#fff5f5] px-4 py-2 text-base font-semibold text-[#d14f4f] transition hover:bg-[#ffebeb] ${
        loading ? "opacity-50" : ""
      }`}
    >
      {loading ? "Đang xóa..." : "Xóa"}
    </button>
  );
}
