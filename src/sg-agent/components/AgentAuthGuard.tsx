"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthUser, getToken } from "@/sg-agent/lib/api";

export function AgentAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setChecked(true));
  }, []);

  useEffect(() => {
    if (!checked) return;

    const token = getToken();
    const user = getAuthUser();

    if (!token || user?.userRole !== "agent") {
      setAllowed(false);
      router.replace("/login");
      return;
    }

    setAllowed(true);
  }, [checked, pathname, router]);

  if (!checked || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
