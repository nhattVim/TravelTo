"use client";

import { useTransition, useState } from "react";
import { formatCurrencyVnd, formatDateVi } from "@/lib/format";
import { useRouter } from "next/navigation";
import { submitPaymentOrder } from "@/lib/api/private";

interface CheckoutFormProps {
  tourId: number;
  departureId: number;
  pricePerGuest: number;
  slotsAvailable: number;
  departureDate: string;
  tourTitle: string;
  token: string;
  initialName: string;
  initialPhone: string;
}

export function CheckoutForm(props: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [guests, setGuests] = useState(1);
  const [contactName, setContactName] = useState(props.initialName);
  const [contactPhone, setContactPhone] = useState(props.initialPhone);
  const [contactNotes, setContactNotes] = useState("");

  const totalPrice = guests * props.pricePerGuest;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guests < 1) return alert("Số lượng khách tối thiểu là 1");
    if (guests > props.slotsAvailable) return alert("Số lượng vượt quá số chỗ còn lại!");
    if (!contactName || !contactPhone) return alert("Vui lòng điền đủ thông tin liên hệ");

    startTransition(async () => {
      try {
        const res = await submitPaymentOrder(props.token, {
          tourId: props.tourId,
          departureId: props.departureId,
          guests,
          contactName,
          contactPhone,
          contactNotes
        });

        if (res.paymentUrl) {
          window.location.href = res.paymentUrl;
        } else {
          alert("Không thể khởi tạo thanh toán VNPay, vui lòng thử lại.");
        }
      } catch (err) {
        alert("Có lỗi xảy ra trong quá trình đặt tour. Vui lòng kiểm tra lại thông tin.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-8">
        <section className="rounded-3xl border border-[#cbeadf] bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#083b2d] mb-6">Thông tin liên hệ</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="contactName" className="text-sm font-medium text-[#2f5b4d]">Họ và tên *</label>
              <input
                id="contactName"
                autoFocus
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full rounded-xl border border-[#a6d5c3] bg-[#f4fffa] px-4 py-3 text-base text-[#1c4d3f] outline-none transition focus:border-[#0a7d59] focus:ring-2 focus:ring-[#0a7d59]/20"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contactPhone" className="text-sm font-medium text-[#2f5b4d]">Số điện thoại *</label>
              <input
                id="contactPhone"
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-xl border border-[#a6d5c3] bg-[#f4fffa] px-4 py-3 text-base text-[#1c4d3f] outline-none transition focus:border-[#0a7d59] focus:ring-2 focus:ring-[#0a7d59]/20"
                placeholder="0987654321"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="contactNotes" className="text-sm font-medium text-[#2f5b4d]">Ghi chú thêm</label>
              <textarea
                id="contactNotes"
                rows={3}
                value={contactNotes}
                onChange={(e) => setContactNotes(e.target.value)}
                className="w-full rounded-xl border border-[#a6d5c3] bg-[#f4fffa] px-4 py-3 text-base text-[#1c4d3f] outline-none transition focus:border-[#0a7d59] focus:ring-2 focus:ring-[#0a7d59]/20"
                placeholder="Yêu cầu ăn kiêng, xe đưa đón..."
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#cbeadf] bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#083b2d] mb-6">Số lượng hành khách</h2>
          <div className="flex items-center justify-between border-b border-[#eafbf3] pb-6">
            <div>
              <p className="text-lg font-semibold text-[#1c4d3f]">Người lớn</p>
              <p className="text-[#355a4d]">{formatCurrencyVnd(props.pricePerGuest)} / khách</p>
            </div>
            <div className="flex items-center gap-4 bg-[#f4fffa] rounded-full p-1 border border-[#cbeadf]">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-10 h-10 rounded-full bg-white border border-[#a6d5c3] text-[#0a7d59] hover:bg-[#ebfff6] transition flex items-center justify-center font-bold text-xl"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold text-[#083b2d]">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(props.slotsAvailable, guests + 1))}
                className="w-10 h-10 rounded-full bg-[#0a7d59] text-white hover:bg-[#085a41] transition flex items-center justify-center font-bold text-xl"
              >
                +
              </button>
            </div>
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-8 space-y-6">
        <section className="rounded-3xl border border-[#cbeadf] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#083b2d] mb-4">Tóm tắt đơn hàng</h3>
          <div className="space-y-4 text-base">
            <div className="border-b border-dashed border-[#a6d5c3] pb-4">
              <p className="font-semibold text-[#1c4d3f]">{props.tourTitle}</p>
              <div className="flex justify-between items-center text-sm text-[#2f5b4d] mt-2">
                <span>Khởi hành:</span>
                <span className="font-semibold">{formatDateVi(props.departureDate)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center font-medium text-[#2f5b4d]">
              <span>Người lớn x {guests}</span>
              <span>{formatCurrencyVnd(totalPrice)}</span>
            </div>

            <div className="pt-4 border-t border-[#dbf2e9] flex justify-between items-end">
              <span className="font-bold text-[#1c4d3f] text-lg">Tổng cộng</span>
              <span className="font-black text-2xl text-[#db2200]">{formatCurrencyVnd(totalPrice)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || guests > props.slotsAvailable}
            className={`mt-6 w-full flex justify-center items-center gap-2 rounded-2xl bg-[#0a7d59] px-6 py-4 font-bold text-white transition ${isPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#085a41] hover:-translate-y-1 shadow-[0_8px_20px_rgba(10,125,89,0.2)]'}`}
          >
            {isPending ? "Đang tạo thanh toán..." : "Thanh toán bằng VNPay"}
            {!isPending && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            )}
          </button>
        </section>
      </aside>
    </form>
  );
}
