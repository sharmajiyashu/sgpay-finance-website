"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hasPermission } from "@/sg-admin/lib/permissions";

export function PropertyAccessGuard({
  children,
  permission = "admin:property:get",
}: {
  children: React.ReactNode;
  permission?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasPermission(permission)) {
      router.replace("/admin/dashboard");
    }
  }, [permission, pathname, router]);

  if (!hasPermission(permission)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">You do not have access to Properties.</p>
      </div>
    );
  }

  return <>{children}</>;
}
