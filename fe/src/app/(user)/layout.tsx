import { SiteShell } from "@/components/layout/site-shell";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return <SiteShell>{children}</SiteShell>;
}
