"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackendHealthCheck({ children }: { children: React.ReactNode }) {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout;

    const checkHealth = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
        // Sử dụng endpoint actuator/health của Spring Boot
        const res = await fetch(`${API_BASE_URL}/actuator/health`, {
          cache: 'no-store',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (res.ok && mounted) {
          setIsHealthy(true);
          // Nếu trước đó đang lỗi, ta có thể refresh lại trang để SSR chạy lại thành công
          if (isHealthy === false) {
            router.refresh();
          }
        } else if (mounted) {
          setIsHealthy(false);
        }
      } catch (err) {
        if (mounted) {
          setIsHealthy(false);
        }
      }
    };

    checkHealth();

    // Polling mỗi 3 giây nếu backend chưa sẵn sàng
    interval = setInterval(() => {
      if (isHealthy !== true) {
        checkHealth();
      }
    }, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [isHealthy, router]);

  // isHealthy === null: Đang check lần đầu, cứ render children (để ko block SSR)
  // isHealthy === true: Backend ổn định, render children bình thường
  // isHealthy === false: Backend lỗi/chưa lên, hiện loading screen đè lên toàn màn hình

  return (
    <>
      {children}
      {isHealthy === false && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center space-y-5 bg-white/95 backdrop-blur-sm">
          <Loader2 className="h-14 w-14 animate-spin text-[#0a7d59]" />
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-[#083b2d]">
              Hệ thống đang khởi động...
            </h2>
          </div>
        </div>
      )}
    </>
  );
}
