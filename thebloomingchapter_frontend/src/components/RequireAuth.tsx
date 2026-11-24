"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PageLoader } from "./ui";

/** Wrap pages that need a logged-in user. staff=true is for the CRM. */
export default function RequireAuth({ children, staff = false }: { children: React.ReactNode; staff?: boolean }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = !!user && (!staff || user.is_staff);

  useEffect(() => {
    if (loading || allowed) return;
    const loginPath = staff ? "/crm/login" : "/login";
    router.replace(`${loginPath}?next=${encodeURIComponent(pathname)}`);
  }, [loading, allowed, staff, router, pathname]);

  if (loading || !allowed) return <PageLoader />;
  return <>{children}</>;
}
