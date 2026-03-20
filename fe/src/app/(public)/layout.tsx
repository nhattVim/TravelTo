import { SiteShell } from "@/components/layout/site-shell";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return <SiteShell>{children}</SiteShell>;
}
