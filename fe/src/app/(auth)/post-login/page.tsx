import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function PostLoginPage() {
  const session = await auth();

  if (!session?.user || !session.backendAccessToken) {
    redirect("/login");
  }

  if (session.user.passwordConfigured === false) {
    redirect("/set-password");
  }

  redirect("/");
}
