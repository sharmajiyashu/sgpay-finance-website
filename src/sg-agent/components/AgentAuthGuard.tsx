"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/sg-agent/lib/api";

export function AgentAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setChecked(true));
  }, []);

  useEffect(() => {
    if (!checked) return;
    if (!getToken()) router.replace("/login");
  }, [checked, pathname, router]);

  if (!checked || !getToken()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
