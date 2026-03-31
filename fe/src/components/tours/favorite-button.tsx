"use client";

import { useState } from "react";
import { addWishlist, removeWishlist } from "@/lib/api/private";
import { useRouter } from "next/navigation";

export function FavoriteButton({ 
  tourId, 
  initialIsWished, 
  token 
}: { 
  tourId: number; 
  initialIsWished: boolean; 
  token?: string;
}) {
  const router = useRouter();
  const [isWished, setIsWished] = useState(initialIsWished);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = async () => {
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
      router.refresh();
    } catch {
      alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-[#0a7d59] py-3 text-sm font-semibold transition ${
        isWished 
          ? "bg-[#e2f5ec] text-[#0a7d59] hover:bg-[#d1ecd0]" 
          : "bg-white text-[#0a7d59] hover:bg-[#f0fbf6]"
      } ${loading ? "opacity-70" : ""}`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill={isWished ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
      {isWished ? "Đã lưu vào yêu thích" : "Thêm vào yêu thích"}
    </button>
  );
}
