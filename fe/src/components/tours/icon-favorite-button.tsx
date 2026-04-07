"use client";

import { useEffect, useState } from "react";
import { addWishlist, checkWishlistStatus, removeWishlist } from "@/lib/api/private";
import { useRouter } from "next/navigation";

export function IconFavoriteButton({
  tourId,
  token,
}: {
  tourId: number;
  token?: string;
}) {
  const router = useRouter();
  const [isWished, setIsWished] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      checkWishlistStatus(token, tourId)
        .then((res) => setIsWished(res.isWished))
        .catch(() => { });
    }
  }, [token, tourId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert("Vui lòng đăng nhập để thêm vào danh sách yêu thích");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      if (isWished) {
        await removeWishlist(token, tourId);
        setIsWished(false);
      } else {
        await addWishlist(token, tourId);
        setIsWished(true);
      }
      router.refresh(); // Refresh currently visible components (like nav-bar user counts or page data)
    } catch {
      alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={toggleWishlist}
      className={`absolute left-3 top-3 cursor-pointer rounded-full p-2 backdrop-blur-sm transition-colors ${isWished
        ? "bg-[#e3241b] text-white hover:bg-red-600"
        : "bg-black/20 text-white hover:bg-black/40"
        } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isWished ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </div>
  );
}
