"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, getAuthUser } from "@/sg-admin/lib/api";

const PUBLIC_ROUTES = ["/admin/login"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setChecked(true));
  }, []);

  useEffect(() => {
    if (!checked) return;
    if (isPublicRoute(pathname)) return;
    const token = getToken();
    const user = getAuthUser();
    if (!token) {
      router.replace("/login");
      return;
    }
    if (user?.userRole && user.userRole !== "admin") {
      router.replace(user.userRole === "agent" ? "/agent/dashboard" : "/login");
    }
  }, [checked, pathname, router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isPublicRoute(pathname) && !getToken()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
