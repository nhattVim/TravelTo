"use client";

import { deleteAccount } from "@/lib/api/private";
import { signOutAction } from "@/lib/auth-actions";
import { useState } from "react";

export function DeleteAccountForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản vĩnh viễn? Dữ liệu đơn đặt chỗ và yêu thích sẽ không thể khôi phục.")) {
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await deleteAccount(token);
      alert("Tài khoản của bạn đã được xóa vĩnh viễn khỏi hệ thống.");
      await signOutAction();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage({ type: "error", text: err.message || "Lỗi khi xóa tài khoản." });
      } else {
        setMessage({ type: "error", text: "Đã xảy ra lỗi không xác định." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#ffefef] pb-4">
        <h2 className="text-2xl font-bold text-[#b92b2b]">Xóa tài khoản vĩnh viễn</h2>
        <p className="mt-1 text-base text-[#7c4d4d]">
          Hành động này không thể hoàn tác. Mọi thông tin cá nhân và lịch sử đặt tour sẽ bị xóa.
        </p>
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 text-base font-medium ${
            message.type === "success"
              ? "bg-[#eafbf3] text-[#0a7d59] border border-[#a2ecd0]"
              : "bg-[#fff5f5] text-[#d14f4f] border border-[#ffb3b3]"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-2xl border border-[#ffe0e0] bg-[#fff5f5] p-5 text-base text-[#d14f4f]">
        <strong>Cảnh báo phân tích rủi ro:</strong>
        <ul className="mt-2 ml-4 list-disc space-y-1 opacity-90">
          <li>Kết nối tới tài khoản Google của bạn sẽ bị hủy bỏ (nếu có).</li>
          <li>Bạn sẽ không thể xem lại các biên nhận đặt tour cũ để sử dụng cho mục đích hoàn tiền hoặc khiếu nại.</li>
          <li>Tất cả các tour lưu trong mục Yêu thích sẽ bị gỡ bỏ vô phương cứu chữa.</li>
        </ul>
      </div>

      <div className="pt-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`rounded-2xl px-8 py-3.5 text-base font-bold uppercase tracking-widest text-white shadow-md transition ${
            loading ? "cursor-not-allowed bg-[#eda4a4]" : "bg-[#d14f4f] hover:bg-[#a83838] hover:shadow-lg"
          }`}
        >
          {loading ? "ĐANG XÓA..." : "XÁC NHẬN XÓA TÀI KHOẢN KHỎI HỆ THỐNG"}
        </button>
      </div>
    </div>
  );
}
