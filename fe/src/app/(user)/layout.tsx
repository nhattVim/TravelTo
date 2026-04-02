import { SiteShell } from "@/components/layout/site-shell";
import { UserSidebar } from "@/components/layout/user-sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default async function UserLayout({ children }: UserLayoutProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SiteShell>
      <div className="mx-auto grid w-full max-w-310 grid-cols-1 gap-8 px-5 py-8 md:grid-cols-4 md:px-8">
        <div className="md:col-span-1">
          <UserSidebar user={session.user} />
        </div>
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </SiteShell>
  );
}
