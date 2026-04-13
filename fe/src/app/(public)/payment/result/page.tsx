import Link from "next/link";

interface PaymentResultPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PaymentResultPage({ searchParams }: PaymentResultPageProps) {
  const { status, bookingId, reason } = await searchParams;

  const isSuccess = status === "success";

  return (
    <div className="mx-auto max-w-2xl text-center space-y-8 py-12">
      <div className="flex justify-center">
        {isSuccess ? (
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-[#0a7d59] opacity-20"></div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="relative h-32 w-32 text-[#0a7d59]">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
            </svg>
          </div>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-32 w-32 text-[#d14f4f]">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      <div className="space-y-4 text-[#1c4d3f]">
        <h1 className="text-4xl font-bold">
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </h1>
        {isSuccess ? (
          <p className="text-lg">
            Cảm ơn bạn đã đặt tour. Mã đơn đặt chỗ của bạn là <span className="font-bold text-[#0a7d59]">#{bookingId}</span>. Mọi thông tin chi tiết sẽ được gửi về qua email và có thể tra cứu tại mục "Đơn đặt chỗ".
          </p>
        ) : (
          <p className="text-lg text-[#d14f4f]">
            Rất tiếc, quá trình giao dịch qua VNPay đã thất bại hoặc bị hủy bỏ. Mã lỗi phụ: <span className="font-bold">{reason || "Không xác định"}</span>
          </p>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        {isSuccess ? (
          <>
            <Link
              href="/bookings"
              className="rounded-2xl bg-[#0a7d59] px-6 py-4 text-base font-bold text-white transition hover:bg-[#085a41]"
            >
              Xem đơn đặt chỗ
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-[#cbeadf] bg-white px-6 py-4 text-base font-bold text-[#0a7d59] transition hover:bg-[#e4fff4]"
            >
              Trở về trang chủ
            </Link>
          </>
        ) : (
          <Link
            href="/tours"
            className="rounded-2xl bg-[#d14f4f] px-6 py-4 text-base font-bold text-white transition hover:bg-[#b03a3a]"
          >
            Tìm tour khác
          </Link>
        )}
      </div>
    </div>
  );
}
