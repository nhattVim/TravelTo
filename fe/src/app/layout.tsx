import type { Metadata } from "next";
import ChatWidget from "@/components/chat/ChatWidget";
import "./globals.css";

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
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
