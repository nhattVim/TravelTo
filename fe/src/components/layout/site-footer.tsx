import Link from "next/link";
import { Mail, Phone, MapPin, Send } from "lucide-react";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#d6efe6] bg-[#f2fdf7] pt-16 pb-8 text-[#2e5a4d]">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-black text-[#083b2d] tracking-tight">Travel<span className="text-[#0a7d59]">To.</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-[#407662]">
              Nền tảng đặt tour du lịch trẻ trung, tiên phong áp dụng công nghệ để mang lại trải nghiệm mượt mà, minh bạch và an toàn nhất cho người Việt.
            </p>
            <div className="flex gap-4">
              <a href="#" className="rounded-full bg-[#e6fff4] p-2.5 text-[#0a7d59] transition hover:bg-[#0a7d59] hover:text-white shadow-sm border border-[#cdece0]"><FacebookIcon className="h-4 w-4" /></a>
              <a href="#" className="rounded-full bg-[#e6fff4] p-2.5 text-[#0a7d59] transition hover:bg-[#0a7d59] hover:text-white shadow-sm border border-[#cdece0]"><InstagramIcon className="h-4 w-4" /></a>
              <a href="#" className="rounded-full bg-[#e6fff4] p-2.5 text-[#0a7d59] transition hover:bg-[#0a7d59] hover:text-white shadow-sm border border-[#cdece0]"><TwitterIcon className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-[#083b2d]">Khám phá</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/tours" className="transition hover:text-[#0a7d59]">Danh sách Tours mở bán</Link></li>
              <li><Link href="/destinations/sa-pa" className="transition hover:text-[#0a7d59]">Điểm đến yêu thích nhất</Link></li>
              <li><Link href="#" className="transition hover:text-[#0a7d59]">Góc cẩm nang chia sẻ</Link></li>
              <li><Link href="#" className="transition hover:text-[#0a7d59]">Kênh Đại lý & Đối tác</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-[#083b2d]">Liên hệ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#0a7d59]" />
                <span className="leading-relaxed">Tầng 8, Tòa nhà TravelTo, Quận Cầu Giấy, Hà Nội</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#0a7d59]" />
                <span className="font-semibold">1900 6868</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#0a7d59]" />
                <span className="font-medium text-[#0a7d59] hover:underline cursor-pointer">support@travelto.vn</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-[#083b2d]">Đăng ký nhận tin</h3>
            <p className="mb-4 text-sm text-[#407662]">
              Lưu ưu đãi mới và nhận voucher giảm giá tới 30% trực tiếp về email của bạn.
            </p>
            <div className="relative flex">
              <input 
                type="email" 
                placeholder="Email tham gia..." 
                className="w-full rounded-full border border-[#cdece0] bg-white px-5 py-3 pr-12 text-sm outline-none transition focus:border-[#0a7d59] focus:ring-2 focus:ring-[#0a7d59]/20" 
              />
              <button aria-label="Đăng ký" className="absolute right-1.5 top-1.5 bottom-1.5 flex aspect-square items-center justify-center rounded-full bg-[#0a7d59] text-white transition hover:scale-105 hover:bg-[#085a41] shadow-md shadow-[#0a7d59]/20">
                <Send className="h-4 w-4 -ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-[#cdece0] pt-8 pb-4 text-sm text-[#5a8b79] md:flex-row">
          <p>TravelTo © 2026. Mọi bản quyền thiết kế được bảo hộ.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-6 md:mt-0 font-medium">
            <Link href="#" className="hover:text-[#0a7d59]">Điều khoản Dịch vụ</Link>
            <Link href="#" className="hover:text-[#0a7d59]">Chính sách Bảo mật</Link>
            <Link href="#" className="hover:text-[#0a7d59]">Quy chế hoạt động</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
