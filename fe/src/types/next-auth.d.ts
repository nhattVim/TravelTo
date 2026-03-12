import { DefaultSession } from "next-auth";
import { UserRole } from "@/types/travel";

declare module "next-auth" {
  interface Session {
    backendAccessToken?: string;
    user: DefaultSession["user"] & {
      id?: string;
      role?: UserRole;
    };
  }

  interface User {
    id?: string;
    role?: UserRole;
    backendAccessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendAccessToken?: string;
    role?: UserRole;
    userId?: string;
  }
}
