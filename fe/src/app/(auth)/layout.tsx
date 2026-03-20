import { SiteShell } from "@/components/layout/site-shell";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <SiteShell>{children}</SiteShell>;
}
