import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const user = req.auth?.user;

  if (pathname.startsWith("/bookings") && !user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/bookings/:path*", "/admin/:path*"],
};
