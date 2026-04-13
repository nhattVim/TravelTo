import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="app-shell flex min-h-screen w-full items-center justify-center p-4">
      <div className="relative w-full max-w-lg">
        {/* Absolute position ensures the link doesn't affect vertical centering of the form */}
        <div className="absolute -top-10 left-2 md:left-0">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a7d59] transition hover:text-[#085a41] hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Quay lại trang chủ
          </Link>
        </div>
        
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
