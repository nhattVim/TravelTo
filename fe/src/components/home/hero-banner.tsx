import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="hero-noise relative overflow-hidden rounded-4xl border border-[#b7f0dd] bg-linear-to-br from-[#defded] via-[#d4f5ff] to-[#fff1d1] px-6 py-14 md:px-12 md:py-20">
      <div className="hero-orb hero-orb-a" />
      <div className="hero-orb hero-orb-b" />
      <div className="relative z-10 max-w-3xl space-y-6">
        <p className="inline-flex rounded-full border border-[#6ad7ae] bg-white/70 px-4 py-1 text-sm font-bold uppercase tracking-[0.2em] text-[#08684b]">
          TravelTo • Vietnam Adventures
        </p>
        <h1 className="text-4xl font-bold leading-tight text-[#063c2c] md:text-6xl">
          Đi du lịch theo cách trẻ trung, năng động và đầy cảm hứng.
        </h1>
        <p className="text-lg text-[#2d5347] md:text-xl">
          Khám phá tour theo từng tỉnh thành Việt Nam, đặt chỗ nhanh và theo dõi lịch trình dễ dàng. Một nền tảng du lịch sinh ra cho thế hệ thích dịch chuyển.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/tours" className="rounded-full bg-[#0a7d59] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#085a41]">
            Khám phá tour ngay
          </Link>
          <Link href="/bookings" className="rounded-full border border-[#0a7d59] bg-white/80 px-6 py-3 text-base font-semibold text-[#0a7d59] transition hover:bg-[#e7fff6]">
            Quản lý đặt chỗ
          </Link>
        </div>
      </div>
    </section>
  );
}
