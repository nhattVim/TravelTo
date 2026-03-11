import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "TravelTo | Website Du Lịch Việt Nam",
  description: "Nền tảng khám phá và đặt tour du lịch Việt Nam theo tỉnh thành.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <div className="app-shell min-h-screen">
          <SiteHeader />
          <main className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-10">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
