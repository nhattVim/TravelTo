import { auth } from "@/auth";
import { getMyWishlists } from "@/lib/api/private";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatCurrencyVnd } from "@/lib/format";
import { WishlistActions } from "./wishlist-actions";

export const metadata = {
  title: "Tour yêu thích | TravelTo",
};

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.backendAccessToken) {
    redirect("/login");
  }

  const wishlists = await getMyWishlists(session.backendAccessToken).catch(() => ({ items: [] }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Wishlist</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#083b2d]">Tour yêu thích</h2>
        <p className="mt-2 text-sm text-[#355a4d]">
          Danh sách các chuyến đi mà bạn đang quan tâm và muốn lưu lại để tham khảo sau.
        </p>
      </header>

      {wishlists.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#98d8c0] bg-[#f8fffb] p-6 text-sm text-[#355a4d]">
          Bạn chưa có tour yêu thích nào.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {wishlists.items.map((item) => (
            <article key={item.id} className="group overflow-hidden rounded-3xl border border-[#d3efe4] bg-white shadow-[0_14px_30px_rgba(14,95,68,0.08)] transition-transform duration-300 hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.tourImageUrl || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"}
                  alt={item.tourTitle}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 space-y-3">
                <h3 className="line-clamp-1 text-lg font-semibold text-[#083b2d]">{item.tourTitle}</h3>
                <p className="text-lg font-bold text-[#0a7d59]">{formatCurrencyVnd(item.tourPrice)}</p>
                <div className="flex items-center justify-between gap-2 pt-2">
                  <Link
                    href={`/tours/${item.tourId}`}
                    className="flex-1 text-center rounded-xl bg-[#0a7d59] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#085a41]"
                  >
                    Xem chi tiết
                  </Link>
                  <WishlistActions token={session.backendAccessToken as string} tourId={item.tourId} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
